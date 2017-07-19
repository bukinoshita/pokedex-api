'use strict'

const signup = (req, res, next) => {
  req.assert('name', 'Your name must have at least 2 characters').len(2, 100)
  req.assert('email', 'Email is invalid').isEmail()
  req.assert('email', 'Email is required').notEmpty()
  req.sanitize('email').normalizeEmail({ removeDots: false })

  const errors = req.validationErrors()

  if (errors) {
    return res.status(400).send({ error: { message: errors[0].msg } })
  }

  return next()
}

exports.signup = signup
