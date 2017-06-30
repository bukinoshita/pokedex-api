module.exports = {
  development: {
    port: 3001,
    host: 'http://localhost:3001'
  },
  staging: {
    host: 'http://pokedex-api-staging,now.sh'
  },
  production: {
    port: 3001,
    host: 'https://pokedex-api.now.sh'
  }
}
