var express = require('express')
var router = express.Router()

const { User } = require("../models")
const userLib = require("../lib/users")
const { verifyAuthToken } = require('../middleware/auth')
const { _s } = require("../middleware/error")
const { filterFormData } = require('../lib/util')

router.get('/', verifyAuthToken, _s(async (req, res) => {
    const user = await User.find().select('_id email').lean()
    res.status(200).json(user)
}))

router.post('/create', verifyAuthToken, _s(async (req, res) => {
    const created = await userLib.create(req.body)
    res.status(200).json({ created })
}))

router.post('/update/:id?', verifyAuthToken, _s(async (req, res) => {
    // for the timebeing, allow updating logged in user only 
    const user = req.user._id // req.params.id (admin only)

    const formData = filterFormData(req.body)

    if (formData.bankTitle || formData.bankName || formData.bankNumber) {
        let paymentDetails = {}

        paymentDetails.bankAccount = {
            name: formData.bankName,
            title: formData.bankTitle,
            number: formData.bankNumber,
        }

        delete formData.bankName
        delete formData.bankTitle
        delete formData.bankNumber
        formData.paymentDetails = paymentDetails
    }

    await userLib.updateUserFields(user, formData)

    res.status(200).json({ success: true })
}))

router.get('/:id', verifyAuthToken, _s(async (req, res) => {
    const user = await userLib.getUserInfo({ id: req.params.id })
    res.status(200).json(user)
}))

module.exports = router
