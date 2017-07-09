'use strict'

const UserModel = require('./../../models/user')
const generateToken = require('./generate-token')
const sendEmailConfirmation = require('./../../helpers/email-confirmation')

module.exports = ({ body }, res) => {
  const { email } = body

  UserModel.findOneSync({ email })
    .then(user => {
      if (user) {
        sendEmailConfirmation(user)
        return res.send({ token: generateToken(user.id), user })
      }

      user = new UserModel({ email })

      user.save(err => {
        if (err) {
          console.log(err)
        }

        sendEmailConfirmation(user)
        res.send({ token: generateToken(user.id), user })
      })
    })
    .catch(() =>
      res.status(500).send({ error: { message: 'Please try again later.' } })
    )
}
