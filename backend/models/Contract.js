const mongoose = require("mongoose")
const { CONTRACT, CURRENCY, TIME } = require("../lib/enum")

const ContractSchema = mongoose.Schema({
    offer:      { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    lender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrower:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details:    String,

    payments:   [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    ],

    rate:       { type: Number, required: true },
    amount:     {
        [CURRENCY.TYPE.FIAT]:   {
            value:        { type: Number, required: true },
            currencyCode: { type: String, default: CURRENCY.FIAT._DEFAULT }
        },
        [CURRENCY.TYPE.CRYPTO]: {
            value:        { type: Number, required: true },
            currencyCode: { type: String, default: CURRENCY.CRYPTO._DEFAULT }
        },
    },

    duration:   {
        amount: { type: Number, default: 30 },
        type:   {
            type: String,
            enum: [...Object.values(TIME.DURATION)],
            default: TIME.DURATION._DEFAULT
        },
    },

    created:    { type: Date, default: Date.now },
    started:    { type: Date, default: Date.now },
    endDate:    Date,
    completed:  Date,
    // expiry:     Date,

    status:     {
        type: String,
        enum: [...Object.values(CONTRACT.STATUS)],
        default: CONTRACT.STATUS._DEFAULT,
    },
})

// Pre hook that is executed before save() to set additional info
ContractSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (CONTRACT.STATUS.IN_EFFECT === this.status) {
            // Calculate the end date based on the start date and any logic you need
            // For example, adding a fixed duration to the start date
            if (this.endDate) {
                return // already set
            }

            const startDate = Date.now()
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + this.duration.amount) // Add 30 days

            this.started = startDate
            this.endDate = endDate
        } else if (CONTRACT.STATUS.ENDED === this.status) {
            if (this.completed) {
                return
            }

            this.completed = Date.now()
        }
    }
    next()
})

// dynamically fill properties based on contract status
// ContractSchema.virtual('endDate').get(() => {
//     if (this.status === CONTRACT.STATUS.IN_EFFECT) {
//         const endDate = new Date(this.startDate)
//         endDate.setDate(endDate.getDate() + 30)

//         return endDate
//     } else {
//         return null
//     }
// })

const Contract = mongoose.model('Contract', ContractSchema)
module.exports = Contract
