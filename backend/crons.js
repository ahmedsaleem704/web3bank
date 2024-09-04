const cron = require('node-cron')
const { getContractList, contractHandlerOnMature } = require('./lib/contracts')
const { CONTRACT } = require('./lib/enum')
const debug = require('./lib/debug')('crons')

const handleContractsToProcess = async () => {
    const contracts = await getContractList({
        status: CONTRACT.STATUS.IN_EFFECT,
        completed: null,
        endDate: { $lte: Date.now() },
    })

    for (const contract of contracts) {
        debug('processing contract', contract._id)
        await contractHandlerOnMature(contract, true)
    }
}

module.exports = () => {
    // process every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        debug('executing handleContractsToProcess')
        await handleContractsToProcess()
    })
}
