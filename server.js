'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')

const env = process.env.NODE_ENV || 'development'
const config = require('./config')[env]
const routes = require('./lib/routes')

const app = express()

app.config = config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger('dev'))
app.set('port', config.port || process.env.PORT)
app.use(cors())
app.options('*', cors())

routes(app)

app.listen(app.get('port'), () => {
  console.log(`Pokedex server is listening on port ${app.get('port')}`)
  console.log(`Environment ${app.get('env')}`)
})

module.exports = app
