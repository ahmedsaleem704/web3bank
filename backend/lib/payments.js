const { Payment } = require("../models")
const { updateContractFields, getPaymentInstruction, advanceContractToNextStage, getPaymentsList } = require("./common")
const { CURRENCY, OFFER, PAYMENT, EVENTS, isValidEnum, CONTRACT } = require("./enum")
const { calculateInterest } = require("./money")
const { checkFieldsExistence, containsAllowedFieldsOnly, isEqualId, getId } = require("./util")

const getPaymentDetails = async (criteria, strict, lean) => {
    const paymentsList = await getPaymentsList(criteria, strict, lean)
    return paymentsList[0]
}

const initiatePayment = async ({ sender, recipient, contract, amount }) => {
    if (!checkFieldsExistence(amount, ['value'])) {
        throw new Error('invalid parameter format: amount must contain value')
    }

    const paymentObject = new Payment({
        sender,
        recipient,
        contract,
        amount,
    })

    return paymentObject.save()
}

const updatePaymentFields = async (paymentId, data) => {
    const payment = await getPaymentDetails({ id: paymentId }, true, false)

    if (!containsAllowedFieldsOnly(data, ['status', 'details', 'screenshot'])) {
        throw new Error(`cannot change restricted fields`)
    }

    if (data.status && !isValidEnum(PAYMENT.STATUS, data.status)) {
        throw new Error(`status ${data.status} is an invalid payment status`)
    }

    Object.assign(payment, data)
    return payment.save()
}

const _buildAmountObject = (amountObj, type) => ({
    value: amountObj[type].value,
    code: amountObj[type].currencyCode,
    type
})

// ignore for now, will add complete logic later
const initiatePaymentOnContractStart = async (contract, offer) => { 
    const isLendingOffer = offer.type === OFFER.TYPE.LEND

    // @TODO: imlement escrow for crypto
    // for simplicity, currently all offers are denominated in FIAT
    // 1. offer to borrow X FIAT for Y amount of time
    //      a. acceptor is the lender then, pays X FIAT first
    //      b. offerer sends equivalent amount = CRYPTO(X)
    //      => offer.acceptor = contract.lender
    // 2. offer to lend X FIAT for Y amount of time
    //      a. acceptor is borrower, pays CRPTO(X)
    //      b. offerer sends X FIAT
    //      => offer.acceptor = contract.borrower
    const initPayType = isLendingOffer ? CURRENCY.TYPE.CRYPTO : CURRENCY.TYPE.FIAT
    const initPayAcceptor = {
        sender:  offer.acceptor,
        recipient: offer.offerer,
        contract,
        amount: _buildAmountObject(contract.amount, initPayType),
    }

    // Also initiate async payment for the other party (the offerer), the type
    // would be opposite for them
    const initPayOffererType = isLendingOffer ? CURRENCY.TYPE.FIAT : CURRENCY.TYPE.CRYPTO
    const initPayOfferer = {
        sender: initPayAcceptor.recipient, // borrower
        recipient: initPayAcceptor.sender, // lender
        contract,
        amount: _buildAmountObject(contract.amount, initPayOffererType),
    }

    const [initPayA, initPayO] = await Promise.all([
        initiatePayment(initPayAcceptor),
        initiatePayment(initPayOfferer)
    ])

    return getPaymentDetails({ id: initPayA._id })
}

const initiatePaymentOnContractMatured = async (contract) => {  
    // a. borrowed X FIAT against Y CRYPTO for Z time
    // b. lent X FIAT against Y crypto for Z time
    //      - borrower returns X+P FIAT, gets back Y crypto
    //      - lender gets back X+P FIAT, pays back Y crypto

    const type = CURRENCY.TYPE.FIAT
    const principal = contract.amount[type].value
    const [_, totalPayback] = calculateInterest(principal, contract.rate, contract.duration)

    const finalPayBorrower = {
        sender: contract.borrower,
        recipient: contract.lender,
        contract,
        amount: {
            type,
            value: totalPayback,
            code: contract.amount[type].currencyCode,
        }
    }

    const finalPayLender = {
        sender: contract.lender,
        recipient: contract.borrower,
        contract,
        amount: _buildAmountObject(contract.amount, CURRENCY.TYPE.CRYPTO)
    }

    const [finalPayB, finalPayL] = await Promise.all([
        initiatePayment(finalPayBorrower),
        initiatePayment(finalPayLender)
    ])

    return [finalPayB, finalPayL]
}

const processPayment = async (payId, userId, action, payment, args) => {
    if (!payment) {
        // also checks if the payment belongs (sender/recepient) to this user
        payment = (await getPaymentsList({ id: payId, userId }, true))[0]
    }

    const handleUpdates = async (newStatus, disallowedStatus = []) => {
        if ([...disallowedStatus, PAYMENT.STATUS.CONFIRMED].includes(payment.status)) {
            throw new Error("unable to process: criteria doesnt meet")
        }

        updatedPayment = await updatePaymentFields(payId, { status: newStatus.payment })
        if (newStatus.contract) {
            if ([CONTRACT.STATUS.IN_EFFECT, CONTRACT.STATUS.ENDED].includes(newStatus.contract)) {
                await advanceContractToNextStage(getId(payment.contract), newStatus.contract)
            } else {
                await updateContractFields(updatedPayment.contract, { status: newStatus.contract })
            }
        }
        return updatedPayment
    }

    // payments are processes at two times
    // 1. when contract has started -> payments processed -> contracts comes in effect
    // 2. when contract has matured -> payments processed -> contract concludes
    let newContractStatus = CONTRACT.STATUS.IN_EFFECT
    if (payment.contract && payment.contract.status === CONTRACT.STATUS.MATURED) {
        newContractStatus = CONTRACT.STATUS.ENDED
    }

    let updatedPayment
    if (EVENTS.PAYMENT.PAY === action) {
        await handleUpdates({
            payment: PAYMENT.STATUS.COMPLETED,
            contract: newContractStatus
        }, [PAYMENT.STATUS.COMPLETED])

    } else if (EVENTS.PAYMENT.INITIATE === action) {
        await handleUpdates({ payment: PAYMENT.STATUS.OPEN }, [PAYMENT.STATUS.COMPLETED])

        return getPaymentInstruction(payment)

    } else if (EVENTS.PAYMENT.CONFIRM === action) {
        if (!isEqualId(payment.recipient, userId)) {
            throw new Error("unable to process: criteria doesnt meet")
        }

        await handleUpdates({ payment: PAYMENT.STATUS.CONFIRMED, contract: newContractStatus })

    } else if (EVENTS.PAYMENT.ATTACH_PROOF === action) {
        await updatePaymentFields(payId, { screenshot: args.imageId })
    }

    return updatedPayment
}

module.exports = {
    getPaymentDetails,

    updatePaymentFields,

    initiatePayment,
    initiatePaymentOnContractStart,
    initiatePaymentOnContractMatured,
    processPayment,
}
