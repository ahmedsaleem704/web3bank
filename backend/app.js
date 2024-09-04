var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const debug = require('./lib/debug')()
const crons = require('./crons')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var accountRouter = require('./routes/account')
var offersRouter = require('./routes/offers')
var contractsRouter = require('./routes/contracts')
var paymentsRouter = require('./routes/payments')
var imagesRouter = require('./routes/images')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users',     usersRouter)
app.use('/account',   accountRouter)
app.use('/offers',    offersRouter)
app.use('/contracts', contractsRouter)
app.use('/payments',  paymentsRouter)
app.use('/images',    imagesRouter)
app.use('/',          indexRouter)

// process crons
crons()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})


// default error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  if (res.headersSent) {
    return next(err)
  }

  // render the error page
  res.status(err.status || 500)
  res.render('error', { error: err })
  debug(err)
})

module.exports = app
