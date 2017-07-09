'use strict'

const pokemonsController = require('./controllers/pokemons')
const pokemonController = require('./controllers/pokemon')
const userController = require('./controllers/user')
const middlewares = require('./middlewares')

module.exports = app => {
  app.use(middlewares.sanitizer)
  app.use(middlewares.populateUser)

  app.get('/pokemons', pokemonsController)

  app.get('/pokemons/:name', pokemonController)

  app.post(
    '/registration',
    userController.validator.signup,
    userController.signup
  )

  app.get('/registration/confirm', userController.confirm)

  app.get(
    '/registration/verify',
    middlewares.authenticated,
    userController.verify
  )

  app.get('/trainer', middlewares.authenticated, userController.get)
}
