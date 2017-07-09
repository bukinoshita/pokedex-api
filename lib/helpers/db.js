'use strict'

const mongoose = require('mongoose')

const env = process.env.NODE_ENV || 'development'
const config = require('../../config')[env]

module.exports = () => {
  mongoose.connect(config.db)
  mongoose.connection.on('error', () =>
    console.log(
      'MongoDB Connection Error. Please make sure that MongoDB is running.'
    )
  )
  mongoose.connection.on('open', () => console.log('Database connection OK'))
}
