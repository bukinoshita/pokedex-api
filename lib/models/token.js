'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')

const schemaOptions = {
  timestamps: true
}

const tokenSchema = new mongoose.Schema(
  {
    token: String,
    userId: String,
    used: { type: Boolean, default: false },
    expired: { type: Boolean, default: false },
    expiresAt: Date,
    type: String,
    metadata: Object
  },
  schemaOptions
)

const token = mongoose.model('Token', tokenSchema)

token.findOneSync = Promise.promisify(token.findOne)
token.findSync = Promise.promisify(token.find)

module.exports = token
