const { Contract } = require("../models")
const { getOfferInfo, updateOfferFields, getPaymentInstruction, updateContractFields } = require("./common")
const { convertFiatDefault, convertCryptoDefault } = require("./money")
const { OFFER, CURRENCY, CONTRACT } = require("./enum")
const { initiatePaymentOnContractStart, initiatePaymentOnContractMatured } = require("./payments")
const { filters, getId } = require("./util")

const _contractAmount = (value, code) => {
    return { value, currencyCode: code }
}

const createContractFromOffer = async ({ offer, details, offerInfo }) => {
    if (!offerInfo) {
        offerInfo = await getOfferInfo({ id: offer }, true)
    }

    if (offerInfo.status !== OFFER.STATUS.ACCEPTED) {
        throw new Error("criteria does not meet for contract creation")
    }

    const lender = offerInfo.type === OFFER.TYPE.LEND ? offerInfo.offerer : offerInfo.acceptor
    const borrower = offerInfo.type === OFFER.TYPE.BORROW ? offerInfo.offerer : offerInfo.acceptor

    let amount = {}
    const offerAmount = [offerInfo.amount, offerInfo.currency.code]
    if (offerInfo.currency.fiat) {
        amount.fiat = _contractAmount(...offerAmount)
        amount.crypto = _contractAmount(convertFiatDefault(...offerAmount), CURRENCY.CRYPTO._DEFAULT)
    } else {
        amount.crypto = _contractAmount(...offerAmount)
        amount.fiat = _contractAmount(convertCryptoDefault(...offerAmount), CURRENCY.FIAT._DEFAULT)
    }

    const newContract = new Contract({
        offer,
        lender,
        borrower,
        amount,
        rate: offerInfo.rate,
        duration: offerInfo.duration,
        details: details ?? offerInfo.details,
        started: Date.now(),
    })

    await newContract.save()
    await updateOfferFields(offer, {
        status: OFFER.STATUS.CONVERTED,
        contract: newContract._id
    })

    const payment = await initiatePaymentOnContractStart(newContract, offerInfo)
    const initialPaymentInstruction = getPaymentInstruction(payment)
    return initialPaymentInstruction
}

const contractHandlerOnMature = async (contract, strict = true) => {
    if (contract.completed || CONTRACT.STATUS.MATURED === contract.status) {
        if (strict) {
            throw new Error('criteria doesnot meet for requested action')
        } else {
            return
        }
    }

    await initiatePaymentOnContractMatured(contract)

    await updateContractFields(getId(contract), { status: CONTRACT.STATUS.MATURED })
}

const getContractInfo = async ({ id, userId }) => {
    return Contract
        .findOne({
            ...(id && { _id: id }),
            ...(userId && { $or: [{ lender: userId }, { borrower: userId }] }),
        })
        .populate("offer", filters.offerContract)
        .populate("lender", filters.userPayment)
        .populate("borrower", filters.userPayment)
        .lean()
}

const getContractList = async (filter) => {
    return Contract
        .find(filter)
        .populate("offer", filters.offerContract)
        .populate("lender", filters.userPayment)
        .populate("borrower", filters.userPayment)
        .lean()
}


module.exports = {
    createContractFromOffer,
    contractHandlerOnMature,
    getContractInfo,
    getContractList,
}
