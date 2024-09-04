const jwt = require("jsonwebtoken")
const userLib = require("../lib/users")
const { _s } = require("./error")

const verifyAuthToken = async (req, res, next) => {
    let payload
    req.user = undefined

    const token = req.cookies.accessToken
    const hasAuthHeaders = req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT'

    if (hasAuthHeaders) {
        payload = req.headers.authorization.split(' ')[1]
    } else {
        payload = token
    }

    if (!payload) {
        throw new Error("forbidden: no auth cookie or headers")
    }

    const decode = jwt.verify(payload, process.env.AUTH_SECRET)
    if (!decode) {
        throw new Error("forbidden: invalid auth token")
    }

    const { password, ...user } = await userLib.getUserInfo({ id: decode.id }, true)
    req.user = user
    next()
}

module.exports = {
    verifyAuthToken: _s(verifyAuthToken)
}
