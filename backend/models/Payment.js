const mongoose = require("mongoose")
const { PAYMENT, CURRENCY } = require("../lib/enum")

const PaymentSchema = mongoose.Schema({
    contract:   { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
    sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details:    String,

    screenshot: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    
    amount:     {
        value:      { type: Number, required: true },
        type:       { type: String, default: CURRENCY.TYPE.CRYPTO },
        code:       { type: String, default: CURRENCY.CRYPTO._DEFAULT },
    },

    created:    { type: Date, default: Date.now },
    completed:  Date,

    status:     {
        type: String,
        enum: [...Object.values(PAYMENT.STATUS)],
        default: PAYMENT.STATUS._DEFAULT,
    },
})

const Payment = mongoose.model('Payment', PaymentSchema)
module.exports = Payment
