/**
 * A wrapper for an async request function, that catches an error throws to
 * handler on next()
 * @param {*} middleware
 * @returns
 */
const safe = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next (err)
        }
    }
}

module.exports = {
    _s: safe,
    safe,
}
