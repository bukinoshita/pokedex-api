'use strict'

const PokemonModel = require('./../../models/pokemon')

module.exports = (req, res) => {
  const pokemon = new PokemonModel(req.body)

  pokemon.save((err, c) => {
    if (err) {
      return res.status(400).send({ error: { message: 'Something is wrong' } })
    }

    return res.status(200).send({ pokemon: c, message: 'Pokemon was born' })
  })
}
