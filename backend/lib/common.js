const { Offer, Contract, Payment } = require("../models")
const { OFFER, isValidEnum, CONTRACT, CURRENCY, PAYMENT } = require("./enum")
const { filters, getId } = require("./util")

/**
 * common code that may be required by more than one library
 */

// ===
// PAYMAENTS
// ===
const getPaymentsList = async ({ id, userId, contractId }, strict = false, lean = true) => {
    const paymentList = await Payment.
        find({
            ...(id && { _id: id }),
            ...(userId && { $or: [{ recipient: userId }, { sender: userId }] }),
            ...(contractId && { contract: contractId }),
        })
        .populate("sender", filters.userPayment)
        .populate("recipient", filters.userPayment)
        .populate("contract")
        .lean(lean)
    
    if (strict && (!paymentList || !paymentList.length)) {
        throw new Error(`payment with provided criteria doesnot exist`)
    }

    return paymentList
}

const getPaymentInstruction = (payment) => {
    const paymentInstruction = {
        payment: {
            id: getId(payment._id),
            amount: payment.amount,
            recipient: payment.amount.type === CURRENCY.TYPE.CRYPTO ? payment.recipient.walletAddress : payment.recipient.paymentDetails.bankAccount
        },
        ...(payment.contract && { contract: getId(payment.contract) }),
        ...(payment.contract.offer && { offer: payment.contract.offer }),
    }

    return paymentInstruction
}

// ===
// CONTRACTS
// ===
const updateContractFields = async (contractId, data) => {
    contractId = getId(contractId)
    const contract = await Contract.findOne({ _id: contractId })
    if (!contract) {
        throw new Error(`contract with id ${contractId} does not exists`)
    }

    if (data.status && !isValidEnum(CONTRACT.STATUS, data.status)) {
        throw new Error(`status ${data.status} is an invalid contract status`)
    }
    Object.assign(contract, data)

    for (const property of Object.keys(data)) {
        contract.markModified(property)
    }

    return contract.save()
}

// Move contract to IN_EFFECT/MATURED stage if all the payments are cleared
const advanceContractToNextStage = async (contractId, newStatus, strict = false) => {
    const contractPayments = await getPaymentsList({ contractId })
    
    const allPaymentsCleared = contractPayments
        .every(_payment => [PAYMENT.STATUS.COMPLETED, PAYMENT.STATUS.CONFIRMED].includes(_payment.status))
    
    if (strict && (!contractPayments.length || !allPaymentsCleared)) {
        throw new Error('unable to update contract: criteria doesnt meet')
    }

    if (allPaymentsCleared) {
        await updateContractFields(contractId, { status: newStatus })
    }
}

// ===
// OFFERS
// ===
const getOfferInfo = async ({ id }, strict = false, lean = true) => {
    const offer = Offer
        .findOne({
            ...(id && { _id: id })
        })

        .populate("offerer", filters.userPayment)
        .populate("acceptor", filters.userPayment)
        .lean(lean)

    if (strict && !offer) {
        throw new Error(`offer with id ${id} does not exists`)
    }

    return offer
}

const updateOfferFields = async (offerId, data) => {
    const offer = await getOfferInfo({ id: offerId }, true, false)

    if (data.status && !isValidEnum(OFFER.STATUS, data.status)) {
        throw new Error(`status ${data.status} is an invalid offer status`)
    }

    Object.assign(offer, data)

    return offer.save()
}

module.exports = {
    getPaymentsList,
    getPaymentInstruction,

    updateContractFields,
    advanceContractToNextStage,

    getOfferInfo,
    updateOfferFields,
}
