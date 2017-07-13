'use strict'

const pokemonsController = require('./controllers/pokemons')
const pokemonController = require('./controllers/pokemon')
const userController = require('./controllers/user')
const rankingsController = require('./controllers/rankings')
const middlewares = require('./middlewares')

const env = process.env.NODE_ENV || 'development'

module.exports = app => {
  app.use(middlewares.sanitizer)
  app.use(middlewares.populateUser)

  app.get('/pokemons', pokemonsController)

  app.get('/pokemons/:pokemonId', pokemonController.get)

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

  app.put('/trainer', middlewares.authenticated, userController.edit)

  app.get('/rankings', rankingsController)

  if (env === 'test') {
    app.post('/pokemons', pokemonController.create)
  }
}
