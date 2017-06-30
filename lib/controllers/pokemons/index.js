'use strict'

const pokemons = require('./../../db/pokemons')

module.exports = (req, res) => {
  return res.send(pokemons)
}
