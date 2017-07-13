'use strict'

const UserModel = require('./../../models/user')

module.exports = (req, res, next) => {
  const sQuery = { name: { $exists: true } }
  let skip = 0
  let limit = 100

  if (req.query.skip && !isNaN(req.query.skip)) {
    skip = parseInt(req.query.skip, 10)
  }

  if (req.query.limit && !isNaN(req.query.limit) && req.query.limit <= 120) {
    limit = parseInt(req.query.limit, 10)
  }

  UserModel.countSync(sQuery)
    .then(total => {
      UserModel.find(sQuery, {}, { skip, limit })
        .sort({ name: -1 })
        .lean()
        .exec((err, trainers) => {
          if (err) {
            return next({
              error: { message: 'Please, try again later.' }
            })
          }

          const result = {
            skip,
            limit,
            total,
            nextPage: total - skip > limit,
            count: trainers.length,
            trainers
          }

          return res.status(200).send(result)
        })
    })
    .catch(next)
}
