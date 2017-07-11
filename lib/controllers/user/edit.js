'use strict'

const UserModel = require('./../../models/user')

const sellPokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    const quantity = data.quantity || 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

    if (user.bag[index].quantity - quantity >= 0) {
      user.bag[index].quantity -= quantity

      return UserModel.update({ _id: user._id }, user, err => {
        if (err) {
          return reject
        }

        resolve({
          status: 200,
          updated: { user, message: 'Profile information updated.' }
        })
      })
    }

    reject(new TypeError(`You don't have ${quantity} pokeballs.`))
  })
}

const buyPokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    const quantity = data.quantity || 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

    user.bag[index].quantity += quantity

    UserModel.update({ _id: user._id }, user, err => {
      if (err) {
        return reject
      }

      resolve({
        status: 200,
        updated: { user, message: 'Profile information updated.' }
      })
    })
  })
}

const updateName = (user, data) => {
  return new Promise((resolve, reject) => {
    user.name = data.name ? data.name : user.name

    user
      .save()
      .then(() => {
        resolve({
          status: 200,
          updated: { user, message: 'Profile information updated.' }
        })
      })
      .catch(err => reject(err))
  })
}

const capturePokemon = (user, data) => {
  return new Promise((resolve, reject) => {
    const quantity = 1

    if (data.type) {
      const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

      if (user.bag[index].quantity - quantity >= 0) {
        user.bag[index].quantity -= quantity
      } else {
        reject(new TypeError(`You don't have ${quantity} pokeballs.`))
      }
    }

    if (data.pokemonId) {
      user.pokemons = [...user.pokemons, data.pokemonId]
    }

    return UserModel.update({ _id: user._id }, user, err => {
      if (err) {
        return reject
      }

      resolve({
        status: 200,
        updated: { user, message: 'Profile information updated.' }
      })
    })
  })
}

module.exports = (req, res, next) => {
  const user = req.user

  if (req.body.type || req.body.pokemonId) {
    capturePokemon(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.name) {
    updateName(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.sell && req.body.type) {
    sellPokeball(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.buy && req.body.type) {
    buyPokeball(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }
}
