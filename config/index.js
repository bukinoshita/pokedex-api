module.exports = {
  development: {
    port: 3001,
    host: 'http://localhost:3001',
    tokenSecret: 'awesome-pokedex',
    db: 'mongodb://localhost/pokedex-api',
    mailgun: {
      apiKey: POKEDEX_MAILGUN_APIKEY,
      from: 'bukinoshita@gmail.com',
      domain: 'pokedex-api.now.sh'
    }
  },
  staging: {
    host: 'http://pokedex-api-staging,now.sh',
    tokenSecret: 'awesome-pokedex',
    db: 'mongodb://localhost/pokedex-api',
    mailgun: {
      apiKey: POKEDEX_MAILGUN_APIKEY,
      from: 'bukinoshita@gmail.com',
      domain: 'pokedex-api.now.sh'
    }
  },
  production: {
    port: 3001,
    host: 'https://pokedex-api.now.sh',
    tokenSecret: 'awesome-pokedex',
    db: 'mongodb://localhost/pokedex-api',
    mailgun: {
      apiKey: POKEDEX_MAILGUN_APIKEY,
      from: 'bukinoshita@gmail.com',
      domain: 'pokedex-api.now.sh'
    }
  }
}
