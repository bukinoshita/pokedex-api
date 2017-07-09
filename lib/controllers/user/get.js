'use strict'

const UserModel = require('./../../models/user')

module.exports = (req, res, next) => {
  if (req.user) {
    return UserModel.findByIdSync(req.user._id)
      .then(user => res.send(user))
      .catch(err => res.send({ message: err }))
  }

  return next()
}
