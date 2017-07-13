'use strict'

const Promise = require('bluebird')

const TokenModel = Promise.promisifyAll(require('./../models/token'))
const UserModel = Promise.promisifyAll(require('./../models/user'))

const env = process.env.NODE_ENV || 'development'

module.exports = () => {
  if (env === 'test') {
    return new Promise((resolve, reject) => {
      Promise.all([UserModel.remove({}), TokenModel.remove({})])
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }
}
