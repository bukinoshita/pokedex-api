module.exports = {
  development: {
    port: 3001,
    host: 'http://localhost:3001',
    tokenSecret: 'awesome-pokedex',
    db: 'mongodb://localhost/pokedex-api',
    mailgun: {
      apiKey: process.env.MAILGUN_APIKEY,
      from: process.env.MAILGUN_FROM,
      domain: process.env.MAILGUN_DOMAIN
    }
  },
  test: {
    port: 3002,
    host: 'http://localhost',
    tokenSecret: 'awesome-pokedex',
    db: 'mongodb://localhost/pokedex-api-test',
    mailgun: {
      apiKey: 'test',
      from: 'test',
      domain: 'test'
    }
  },
  production: {
    port: 3001,
    host: 'https://pokedex-api.now.sh',
    tokenSecret: process.env.TOKEN_SECRET,
    db: `mongodb://${process.env.DB_USER}:${process.env
      .DB_PASSWORD}@ds151702.mlab.com:51702/pokedex-api`,
    mailgun: {
      apiKey: process.env.MAILGUN_APIKEY,
      from: process.env.MAILGUN_FROM,
      domain: process.env.MAILGUN_DOMAIN
    }
  }
}
