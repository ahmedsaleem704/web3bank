var express = require('express')
var router = express.Router()

const contractLib = require("../lib/contracts")
const { getOfferInfo } = require('../lib/common')
const { verifyAuthToken } = require("../middleware/auth")
const { _s } = require("../middleware/error")
const { collectionSortFnTypeA } = require('../lib/util')

router.get('/list/user/:id?', verifyAuthToken, _s(async (req, res) => {
    const user = req.params.id ? req.params.id : req.user._id

    if (!user) {
        throw new Error("user id not provided")
    }

    const contracts = await contractLib.getContractList()
    contracts.sort(collectionSortFnTypeA('status', 'created'))

    return res.status(200).json({ contracts })
}))

router.get('/list', verifyAuthToken, _s(async (req, res) => {
    const contracts = await contractLib.getContractList()
    contracts.sort(collectionSortFnTypeA('status', 'created'))
    return res.status(200).json({ contracts })
}))

router.post('/start', verifyAuthToken, _s(async (req, res) => {
    const userId = req.user._id
    const offerId = req.body.offer
    const offer = await getOfferInfo({ id: offerId }, true)

    if (!offerId || // offer doesn't exist
        (offer.offerer !== userId && offer.acceptor !== userId)) { // offer not ready
        throw new Error("cannot create a contract for this offer")
    }

    const created = await contractLib.createContractFromOffer({
        offer: offerId,
        offerInfo: offer,
        details: req.body.details,
    })

    return res.status(200).json({ created })
}))

module.exports = router
