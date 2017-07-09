'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const expressValidator = require('express-validator')
const mongoose = require('mongoose')

const env = process.env.NODE_ENV || 'development'
const config = require('./config')[env]
const connectDb = require('./lib/helpers/db')
const routes = require('./lib/routes')

const app = express()

mongoose.Promise = global.Promise

connectDb()

app.config = config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(expressValidator())
app.set('port', config.port || process.env.PORT)
app.use(cors())
app.options('*', cors())

routes(app)

app.listen(app.get('port'), () => {
  console.log(
    `Pokedex server is listening on port ${app.get(
      'port'
    )} (http://localhost:${app.get('port')})`
  )
  console.log(`Environment ${app.get('env')}`)
})

module.exports = app
