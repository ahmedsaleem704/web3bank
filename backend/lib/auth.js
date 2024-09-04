const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SALT_ROUNDS = 8
const AUTH_EXPIRY = 86400

const passwordEncrypt = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS)
}

const passwordValidate = async (enteredPassword, userPassword) => {
    return bcrypt.compare(enteredPassword, userPassword)
}

const getSignedAuthToken = async (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, process.env.AUTH_SECRET, {
        expiresIn: AUTH_EXPIRY
    })
}

module.exports = {
    passwordEncrypt,
    passwordValidate,
    getSignedAuthToken,
}
