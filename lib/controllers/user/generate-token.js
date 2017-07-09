'use strict'

const jwt = require('jsonwebtoken')
const moment = require('moment')

const env = process.env.NODE_ENV || 'development'
const config = require('./../../../config')[env]

/**
 * Generate authentication token
 * with 15 days expiration
 *
 * @param  {String}  userId
 *
 * @return {String}  jwt signed token
 */

module.exports = userId => {
  const payload = {
    iss: 'pokemon.com',
    sub: userId,
    iat: moment().unix(),
    exp: moment().add(15, 'days').unix()
  }
  return jwt.sign(payload, config.tokenSecret)
}
