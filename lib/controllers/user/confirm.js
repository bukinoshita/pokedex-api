'use strict'

const TokenModel = require('../../models/token')
const UserModel = require('../../models/user')

module.exports = (req, res, next) => {
  let token = null

  TokenModel.findOneSync({ token: req.query.token })
    .then(t => {
      if (!t || t.used) {
        return res.status(400).send({ error: { message: 'Token is invalid' } })
      }

      token = t
      return UserModel.findByIdSync({ _id: t.userId })
    })
    .then(user => {
      if (!user) {
        return res
          .status(500)
          .send({ error: { message: 'Something is wrong' } })
      }

      if (user.emailConfirmed) {
        token.used = true
        token.save(err => {
          console.log(err)

          res.redirect('https://twitter.com/bukinoshita')
        })

        return
      }

      user.emailConfirmed = true
      user.save(err => {
        console.log(err)
      })

      token.used = true
      token.save(err => {
        console.log(err)
      })

      res.redirect('https://twitter.com/bukinoshita')
    })
    .catch(next)
}
