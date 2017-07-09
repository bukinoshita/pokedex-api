'use strict'

const sanitize = require('mongo-sanitize')

/*
 * Apply mongo sanitize to query body params objects
*/

module.exports = (req, res, next) => {
  Object.keys(req.body).forEach(param => {
    req.body[param] = sanitize(req.body[param])
  })

  Object.keys(req.params).forEach(param => {
    req.params[param] = sanitize(req.params[param])
  })

  Object.keys(req.query).forEach(param => {
    req.query[param] = sanitize(req.query[param])
  })

  return next()
}
