'use strict'

const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const tokenModel = require('../models/token')

const env = process.env.NODE_ENV || 'development'
const config = require('../../config')[env]

module.exports = (req, res, next) => {
  req.isAuthenticated = () => {
    const token = req.headers.authorization

    try {
      return jwt.verify(token, config.tokenSecret)
    } catch (err) {
      return false
    }
  }

  if (req.isAuthenticated()) {
    const payload = req.isAuthenticated()

    return tokenModel
      .find({ userId: payload.sub })
      .sort({ createdAt: -1 })
      .lean()
      .exec((err, tokens) => {
        if (err) {
          return res.status(400).send({ error: { message: err } })
        }

        if (tokens[0] && tokens[0].used && !tokens[0].expired) {
          return userModel.findByIdSync(payload.sub).then(user => {
            req.user = user
            return next()
          })
        }

        return next()
      })
  }

  return next()
}
