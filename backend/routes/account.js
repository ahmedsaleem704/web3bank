var express = require('express')
var router = express.Router()

const userLib = require("../lib/users")
const { verifyAuthToken } = require("../middleware/auth")
const { _s } = require("../middleware/error")

router.post('/signup', _s(async (req, res) => {
  const newUser = await userLib.create(req.body)
  res.status(200).json({ success: true, newUser })
}))

router.post('/login', _s(async (req, res) => {
  const { email, password } = req.body
  const { accessToken, user } = await userLib.authenticateUser(email, password)

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true
    })
    .status(200)
    .json({ success: true, user })

}))

router.all('/logout', verifyAuthToken, _s(async (req, res) => {
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true })
}))

module.exports = router
