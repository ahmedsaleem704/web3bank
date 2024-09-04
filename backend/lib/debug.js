const debug = require("debug")

module.exports = (namespace = 'server') => {
    const logger = debug(`backend:${namespace}`)
    logger.log = console.log.bind(console)

    return logger
}
