var express = require('express')
var router = express.Router()

const paymentLib = require("../lib/payments")
const { getPaymentsList } = require("../lib/common")
const { verifyAuthToken } = require("../middleware/auth")
const { _s } = require("../middleware/error")
const { collectionSortFnTypeA } = require('../lib/util')

router.get('/list/user/:id?', verifyAuthToken, _s(async (req, res) => {
    const user = req.params.id ? req.params.id : req.user._id

    if (!user) {
        throw new Error("user id not provided")
    }

    const payments = await getPaymentsList({ userId: user })
    payments.sort(collectionSortFnTypeA('status', 'created'))

    res.status(200).json({ payments })
}))

router.post('/pay/:id', verifyAuthToken, _s(async (req, res) => {
    // also checks if the payment belongs (sender/recepient) to this user
    const args = req.body
    const { action, ...rest } = args
    
    const details = await paymentLib.processPayment(req.params.id, req.user._id, action, undefined, rest)
    res.status(200).json({ success: true, details })
}))

router.get('/:id', verifyAuthToken, _s(async (req, res) => {
    const payment = await paymentLib.getPaymentDetails({ id: req.params.id })
    res.status(200).json(payment)
}))

module.exports = router
