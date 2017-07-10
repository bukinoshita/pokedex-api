'use strict'

const PokemonModel = require('./../../models/pokemon')

module.exports = (req, res) => {
  return PokemonModel.find({})
    .sort({ pokedexNumber: -1 })
    .lean()
    .exec((err, pokemons) => {
      if (err) {
        return res.status(400).send({ error: { message: err } })
      }

      return res.status(200).send({ pokemons })
    })
}
