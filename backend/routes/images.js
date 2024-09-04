var express = require('express')
var router = express.Router()

const { _s } = require("../middleware/error")
const { verifyAuthToken } = require("../middleware/auth")
const { getImage, upload, uploadImage, getImageUrl } = require('../lib/images')


router.post('/upload', verifyAuthToken, upload.single('image'), _s(async (req, res) => {
    console.log(req.file)
    const image = {
        data: new Buffer.from(req.file.buffer, 'base64'),
        contentType: req.file.mimetype,
    }

    const savedImage = await uploadImage(image)
    res.send({
        id: savedImage._id
    })
}))

router.get('/:id', verifyAuthToken, _s(async (req, res) => {
    const image = await getImageUrl({ id: req.params.id }, true)
    res.send(image)
}))


module.exports = router
