'use strict'

const crypto = require('crypto')
const Promise = require('bluebird')

const TokenModel = require('../models/token')
const transporter = require('../services/mailer')

crypto.randomBytesSync = Promise.promisify(crypto.randomBytes)

const env = process.env.NODE_ENV || 'development'
const config = require('../../config')[env]

/**
 * Send email confirmation
 *
 * @param  {Object} user object
 */
module.exports = user => {
  crypto
    .randomBytesSync(30)
    .then(buffer => {
      const confirmationToken = buffer.toString('hex')

      const token = new TokenModel({
        token: confirmationToken,
        userId: user.id
      })

      token.save(err => {
        if (err) {
          console.log(err)
        }
      })

      const mailOptions = {
        to: user.email,
        subject: 'Verify your email address to use pokemon-game',
        text: `${config.host}/registration/confirm?email=${user.email}&token=${confirmationToken}`
      }

      transporter.sendMail(mailOptions, err => {
        if (err) {
          return console.log(err)
        }

        console.log('confirmation email sent')
      })
    })
    .catch(err => {
      console.log(err)
    })
}
