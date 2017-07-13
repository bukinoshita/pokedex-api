'use strict'

const getPokeball = require('get-pokeball')

const UserModel = require('./../../models/user')

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

const removePokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    const quantity = 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

    if (user.bag[index].quantity - quantity >= 0) {
      user.bag[index].quantity -= quantity
    } else {
      reject(new TypeError(`You don't have ${quantity} pokeballs.`))
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

const addPokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    const quantity = 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

    user.bag[index].quantity += quantity

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

const addPokemon = (user, data) => {
  return new Promise((resolve, reject) => {
    user.pokemons = [...user.pokemons, data.pokemonId]

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

const sellPokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    Promise.all([removePokeball(user, data), getPokeball(data.type)])
      .then(res => {
        const pokeballRemoved = res[0]
        const price = res[1].price.sell

        if (pokeballRemoved && price) {
          user.balance += price

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

        return reject
      })
      .catch(err => reject(err))
  })
}

const buyPokeball = (user, data) => {
  return new Promise((resolve, reject) => {
    Promise.all([addPokeball(user, data), getPokeball(data.type)])
      .then(res => {
        const pokeballAdded = res[0]
        const price = res[1].price.buy

        if (pokeballAdded && user.balance - price >= 0) {
          user.balance -= price

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

        return reject(
          new TypeError({
            error: { message: `You don't have sufficient money` }
          })
        )
      })
      .catch(err => reject(err))
  })
}

module.exports = (req, res, next) => {
  const user = req.user

  if (req.body.name) {
    updateName(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.capture && req.body.type) {
    removePokeball(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.pokemonId) {
    addPokemon(user, req.body)
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
