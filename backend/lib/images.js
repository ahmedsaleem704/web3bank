const multer = require("multer")
const { Image } = require("../models")

const multerStorage = multer.memoryStorage()
const upload = multer({ storage: multerStorage, })

const getImage = async ({ id }, strict = false) => {
    const image = await Image
        .findOne({ _id: id })
        .lean()
        .exec()

    if (strict && !image) {
        throw new Error(`image with id ${id} does not exist`)
    }

    return image
}

const getImageUrl = async ({ id }, strict = false) => {
    const imageBuffer = await getImage({ id }, strict)
    const base64Data = imageBuffer.image.data.toString('base64')
    // console.dir({ imageBuffer, base64Data }, { depth: null })
    const imageUrl = `data:image/jpeg;base64,${base64Data}`

    return imageUrl
}

const uploadImage = async (image) => {
    return Image.create({ image })
}

module.exports = {
    multerStorage,
    upload,

    getImage,
    getImageUrl,
    uploadImage,
}
