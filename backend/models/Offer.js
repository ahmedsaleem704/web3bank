const mongoose = require("mongoose")
const { OFFER, CURRENCY, TIME } = require("../lib/enum")

const OfferSchema = mongoose.Schema({
    offerer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    acceptor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contract:   { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    details:    String,

    rate:       { type: Number, required: true },
    amount:     { type: Number, required: true },

    created:    { type: Date, default: Date.now },
    expiry:     Date,
    duration:   {
        amount: { type: Number, default: 30 },
        type:   {
            type: String,
            enum: [...Object.values(TIME.DURATION)],
            default: TIME.DURATION._DEFAULT
        },
    },

    type:       {
        type: String,
        enum: [...Object.values(OFFER.TYPE)],
        required: true,
    },

    status:     {
        type: String,
        enum: [...Object.values(OFFER.STATUS)],
        default: OFFER.STATUS._DEFAULT,
    },

    currency:   {
        code: { type: String, default: CURRENCY.FIAT._DEFAULT },
        fiat: { type: Boolean, default: true },
    },
})

const Offer = mongoose.model('Offer', OfferSchema)
module.exports = Offer
