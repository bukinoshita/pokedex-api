'use strict'

const Mailgun = require('mailgun-js')

const env = process.env.NODE_ENV || 'development'
const config = require('../../config')[env]

const { apiKey, domain, from } = config.mailgun
const mailgun = new Mailgun({ apiKey, domain })

const transporter = {
  sendMail: data => {
    data.from = from
    mailgun.messages().send(data, err => {
      if (err) {
        console.log(`[email] error: ${err}`)
      }

      console.log(`[email] success: ${data.to}`)
    })
  }
}

// Do not send emails on test env
if (env === 'test') {
  transporter.sendMail = () => {
    console.log('[test]: email sent')
  }
}

module.exports = transporter
