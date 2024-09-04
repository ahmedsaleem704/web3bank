var express = require('express')
var router = express.Router()

// homepage
router.get('/', function(req, res, _next) {
  res.render('index', { title: 'Web3Bank' })
})

module.exports = router
