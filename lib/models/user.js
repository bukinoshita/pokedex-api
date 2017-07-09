'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')

const schemaOptions = {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true
  }
}

const userSchema = new mongoose.Schema(
  {
    token: String,
    name: String,
    email: { type: String, unique: true },
    emailConfirmed: { type: Boolean, default: false },
    balance: {
      type: Number,
      default: 1000
    }
  },
  schemaOptions
)

userSchema.options.toJSON = {
  transform: (doc, ret) => {
    delete ret.__v
  }
}

const User = mongoose.model('User', userSchema)

User.findOneSync = Promise.promisify(User.findOne)
User.findByIdSync = Promise.promisify(User.findById)
User.findSync = Promise.promisify(User.find)
User.findOneAndUpdateSync = Promise.promisify(User.findOneAndUpdate)

module.exports = User