'use strict'

const TokenModel = require('../../models/token')

module.exports = (req, res) => {
  const { userId } = req.query

  if (userId) {
    return TokenModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec((err, tokens) => {
        if (err) {
          return res.status(400).send({ error: { message: err } })
        }

        if (tokens.length > 1) {
          TokenModel.update(tokens[1], { expired: true }, err => {
            if (err) {
              return res.status(400).send({ error: { message: err } })
            }
          })
        }

        const { used, expired } = tokens[0]

        if (used && !expired) {
          return res.status(200).send({ status: true })
        }

        return res.status(200).send({ status: false })
      })
  }

  return res.send({ status: false })
}
