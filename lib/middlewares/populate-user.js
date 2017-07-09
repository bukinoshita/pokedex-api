'use strict'

const jwt = require('jsonwebtoken')
const userModel = require('../models/user')

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
    userModel.findByIdSync(payload.sub).then(user => {
      req.user = user
      return next()
    })
  } else {
    return next()
  }
}
