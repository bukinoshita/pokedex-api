'use strict'

const UserModel = require('./../../models/user')

module.exports = (req, res, next) => {
  if (req.user) {
    return UserModel.findById(req.user._id)
      .populate({ path: 'pokemons', model: 'Pokemon' })
      .exec((err, user) => {
        if (err) {
          return res.status(400).send({ error: { message: err } })
        }

        return res.status(200).send(user)
      })
  }

  return next()
}
