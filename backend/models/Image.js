const mongoose = require("mongoose")

const ImageSchema = mongoose.Schema({
    image: {
        data: { type: Buffer, required: true },
        contentType: String,
    },
}, { timestamps: true })

const Image = mongoose.model('Image', ImageSchema)
module.exports = Image
