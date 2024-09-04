const mongoose = require("mongoose")
const { USER } = require("../lib/enum")

const UserSchema = mongoose.Schema({
    // id:             { type: Number, required: true, unique: true },
    firstName:      { type: String, required: true },
    lastName:       { type: String, required: true },
    password:       { type: String, required: true },
    verified:       { type: Boolean, default: false },
    address:        { type: String },
    walletAddress:  { type: String, required: true },
    permissions:    [String],
    phone:          {
        type: Number,
        min: [300_0000000, 'Phone number must be 10 digits (without 0)'],
        max: [350_0000000, 'Phone number must be 10 digits (without 0)']
    },
    cnic:           {
        type: Number,
        unique: true,
        required: true,
        min: [10000_0000000_1, 'CNIC Number must be 13 digits without dashes'],
        max: [99999_9999999_9, 'CNIC Number must be 13 digits without dashes']
    },
    email:          {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
        },
    },
    paymentDetails: {
        bankAccount: {
            title: String,
            number: String,
            name: String,
        },
        cryptoWallet: {
            // @TODO move to cryptoWallet.address from walletAddress
            address: String,
        }
    },
    role:           {
        type: String,
        enum: [...Object.values(USER.ROLE)],
        default: USER.ROLE.USER
    },
})

const User = mongoose.model('User', UserSchema)
module.exports = User
