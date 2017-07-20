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
    const quantity = data.quantity || 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)
    if (user.bag[index].quantity - quantity >= 0) {
      user.bag[index].quantity -= parseInt(quantity)
    } else {
      return reject(`You don't have enough Pokéballs`)
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
    const quantity = data.quantity || 1
    const index = user.bag.findIndex(pokeball => pokeball.slug === data.type)

    user.bag[index].quantity += parseInt(quantity)

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
    user.pokemons.addToSet(data.pokemonId)
    user.pokedex = user.pokemons.length

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
    data.quantity = data.quantity || 1
    Promise.all([removePokeball(user, data), getPokeball(data.type)])
      .then(res => {
        const pokeballRemoved = res[0]
        const price = res[1].price.sell * parseInt(data.quantity)

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
    data.quantity = data.quantity || 1
    Promise.all([addPokeball(user, data), getPokeball(data.type)])
      .then(res => {
        const pokeballAdded = res[0]
        const price = res[1].price.buy * parseInt(data.quantity)

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

        return reject(`You don't have sufficient money`)
      })
      .catch(err => reject(err))
  })
}

module.exports = (req, res, next) => {
  const user = req.user

  if (req.body.name) {
    return updateName(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.capture && req.body.type && req.body.pokemonId) {
    return Promise.all([
      removePokeball(user, req.body),
      addPokemon(user, req.body)
    ])
      .then(resp => res.status(resp[1].status).send(resp[1].updated))
      .catch(err => {
        res.status(400).send({ error: { message: err } })
      })
  }

  if (req.body.pokemonId) {
    return addPokemon(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(next)
  }

  if (req.body.sell && req.body.type) {
    return sellPokeball(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(err => res.status(400).send({ error: { message: err } }))
  }

  if (req.body.buy && req.body.type) {
    return buyPokeball(user, req.body)
      .then(resp => res.status(resp.status).send(resp.updated))
      .catch(err => res.status(400).send({ error: { message: err } }))
  }
}
