'use strict'

const pokemons = require('./../../db/pokemons')

module.exports = (req, res) => {
  const name = req.params.name

  const pokemon = pokemons.filter(pokemon => {
    if (pokemon.name.toLowerCase() === name) {
      return pokemon
    }

    return false
  })[0]

  if (pokemon) {
    return res.status(200).send(pokemon)
  }

  return res.status(404).send(`${name} not found`)
}
