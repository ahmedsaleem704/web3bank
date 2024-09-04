var express = require('express')
var router = express.Router()

const offerLib = require("../lib/offers")
const { getOfferInfo } = require('../lib/common')
const { verifyAuthToken } = require("../middleware/auth")
const { _s } = require("../middleware/error")
const { collectionSortFnTypeA } = require('../lib/util')

router.get('/', _s((req, res) => {
    res.redirect(302, '/offers/list')
}))

router.get('/list/user/:id?', verifyAuthToken, _s(async (req, res) => {
    const user = req.params.id ? req.params.id : req.user._id

    if (!user) {
        throw new Error("user id not provided")
    }

    const offers = await offerLib.getOfferList({
        $or: [{ offerer: user }, { acceptor: user }]
    })

    return res.status(200).json({ offers })
}))

router.get('/list/:filter?', verifyAuthToken, _s(async (req, res) => {
    const filter = req.params.filter
    let offers

    if (filter && !/all|lend|borrow/.test(filter)) {
        throw new Error("invalid offers list filter")
    }

    if (!filter || filter === "all") {
        offers = await offerLib.getOfferList()
    } else {
        offers = await offerLib.getOfferList({ type: filter })
    }
    offers.sort(collectionSortFnTypeA('type', 'created'))
    return res.status(200).json({ offers })
}))

router.post('/create', verifyAuthToken, _s(async (req, res) => {
    const offerer = req.user._id

    const created = await offerLib.createOffer({ offerer, ...req.body })
    return res.status(200).json({ created })
}))

router.get('/:id/convert', verifyAuthToken, _s(async (req, res) => {
    const acceptor = req.user._id

    const payment = await offerLib.convertOfferToContract(acceptor, req.params.id)
    return res.status(200).json(payment)
}))

router.get('/:id', verifyAuthToken, _s(async (req, res) => {
    const offer = await getOfferInfo({ id: req.params.id })
    return res.status(200).json(offer)
}))

module.exports = router
