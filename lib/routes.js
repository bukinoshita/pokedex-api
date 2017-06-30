'use strict'

const pokemonsController = require('./controllers/pokemons')
const pokemonController = require('./controllers/pokemon')

module.exports = app => {
  app.get('/pokemons', pokemonsController)

  app.get('/pokemons/:name', pokemonController)
}
