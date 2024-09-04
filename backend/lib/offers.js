const { createContractFromOffer } = require("./contracts")
const { Offer } = require("../models")
const { OFFER } = require("./enum")
const { updateOfferFields } = require("./common")
const { filters } = require("./util")

const createOffer = async ({ offerer, details, type, amount, rate, duration }) => {

    const newOffer = new Offer({
        offerer,
        details,
        type,
        amount,
        rate,
        duration: {
            amount: duration,
        },
    })

    return newOffer.save()
}

const getOfferList = async (filter) => {
    return Offer
        .find(filter)
        .populate("offerer", filters.userPayment)
        .populate("acceptor", filters.userPayment)
        .lean()
}

const acceptOffer = async ({ acceptor, id }) => {
    const offer = await Offer.findOne({ _id: id })

    if (!offer) {
        throw new Error(`offer with id ${id} does not exists`)
    }

    if (offer.status !== OFFER.STATUS.PENDING) {
        throw new Error(`offer can't be accepted  (current status: ${offer.status})`)
    }

    offer.status = OFFER.STATUS.ACCEPTED
    offer.acceptor = acceptor

    return offer.save()
}

const convertOfferToContract = async (acceptor, _offer) => {
    const offer = await acceptOffer({ acceptor, id: _offer })

    let paymentInstruction
    try {
        paymentInstruction = await createContractFromOffer({ offer: offer._id })
    } catch (err) {
        await updateOfferFields(_offer, { status: OFFER.STATUS.PENDING })
        throw err 
    }

    return paymentInstruction
}

module.exports = {
    getOfferList,

    createOffer,
    acceptOffer,
    convertOfferToContract,
}
