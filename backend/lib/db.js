const debug = require('./debug')('db')
const mongoose = require('mongoose')

const connString = process.env.DB_URI_ATLAS
const connConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'w3b-db',
}

mongoose.set('strictQuery', true)

const db = mongoose.connection

const connectToServer = async (callback) => {
    try {
        await mongoose.connect(connString, connConfig)
        debug('Successfuly connected to MongoDB')
    } catch (err) {
        debug(err)
        callback(err)
    }

    callback()
}

module.exports = {
    connectToServer,
    db,
    usersDb: db.collection("users"),
    offersDb: db.collection("offers"),
}
