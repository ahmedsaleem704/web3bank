const constructField = (_id, _text, options) => {
    const defaultOptions = {
        _required: true,
        _type: "text",
        _ph: _text,
    }

    options = Object.assign({}, defaultOptions, options)

    return {
        labelText: _text,
        labelFor: _id,
        id: _id,
        name: _id,
        type: options._type,
        autoComplete: _id,
        isRequired: options._required,
        placeholder: options._ph,
    }
}

//
//
const loginFields = [
    constructField("email", "Email Address", { _type: "email" }),
    constructField("password", "Password", { _type: "password" }),
]

const profileFields = [
    constructField("phone", "Phone Number (without leading 0)", { _type: "number" }),
    constructField("address", "Home Address"),
    constructField("walletAddress", "Wallet Address", { _ph: "Wallet Address (0x...)" }),
]

const signupFields = [
    ...loginFields,

    constructField("firstName", "First Name"),
    constructField("lastName", "Last Name"),
    constructField("cnic", "CNIC (Without Dashes)", { _type: "number" }),

    ...profileFields,
]

const newOfferFields = [
    constructField("type", "Type", { _ph: "Offer Mode (Lend/Borrow?)" }),
    constructField("amount", "Amount", { _type: "number" }),
    constructField("rate", "Interest Rate", { _type: "number" }),
    constructField("duration", "Duration (days)", { _type: "number" }),
    constructField("details", "Additional Details", { _required: false }),
]

const editProfileFields = [
    ...profileFields,
    constructField("bankName", "Bank Name", { _required: false }),
    constructField("bankTitle", "Account Title", { _required: false }),
    constructField("bankNumber", "Account Number", { _required: false }),
]

const paymentProofFields = [
    constructField("image", "Image", { _type: "file" }),
]

export {
    loginFields,
    signupFields,
    newOfferFields,
    editProfileFields,
    paymentProofFields,
}