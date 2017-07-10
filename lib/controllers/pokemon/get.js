'use strict'

const PokemonModel = require('./../../models/pokemon')

module.exports = (req, res) => {
  const pokemonId = req.params.pokemonId

  return PokemonModel.findByIdSync({ _id: pokemonId })
    .then(pokemon => res.status(200).send(pokemon))
    .catch(err => res.status(404).send(err))
}
