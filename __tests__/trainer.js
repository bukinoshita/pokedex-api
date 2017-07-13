'use strict'

const assert = require('assert')
const request = require('supertest')

const server = require('./../server')
const resetDb = require('./../lib/helpers/reset-db')
const TokenModel = require('./../lib/models/token')

describe('trainer', () => {
  before(done => {
    resetDb().then(done).catch(done)
  })

  let userId = null
  let token = null

  it('should register user', done => {
    const data = { email: 'bukinoshita@gmail.com' }
    request(server)
      .post('/registration')
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.ok(res.body.token)
        assert.ok(res.body.user)
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 0)
        assert.equal(res.body.user.balance, 1000)
        assert.equal(res.body.user.emailConfirmed, false)
        assert.equal(res.body.user.email, data.email)

        userId = res.body.user._id
        token = res.body.token

        done()
      })
  })

  it('should fail on register', done => {
    const data = { email: 'bukinoshita' }
    request(server)
      .post('/registration')
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        done()
      })
  })

  it('should confirm user', done => {
    TokenModel.findOneSync({ userId })
      .then(t => {
        request(server)
          .get(`/registration/confirm?token=${t.token}`)
          .expect(302)
          .end((err, res) => {
            if (err) {
              console.error(res.error)
              return done(err)
            }

            assert.ok(
              res.text ===
                'Found. Redirecting to https://pokemon-game.now.sh/confirmed'
            )
            done()
          })
      })
      .catch(done)
  })

  it('should confirm user', done => {
    TokenModel.findOneSync({ userId })
      .then(t => {
        request(server)
          .get(`/registration/confirm?token=${t.token}`)
          .expect(400)
          .end((err, res) => {
            if (err) {
              console.error(res.error)
              return done(err)
            }

            assert.equal(res.body.error.message, 'Token is invalid')
            done()
          })
      })
      .catch(done)
  })

  it('should verify user', done => {
    request(server)
      .get(`/registration/verify?userId=${userId}`)
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.status, true)

        done()
      })
  })

  it('should get trainer', done => {
    request(server)
      .get('/trainer')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.bag.length, 4)
        assert.equal(res.body.pokemons.length, 0)
        assert.equal(res.body.balance, 1000)
        assert.equal(res.body.emailConfirmed, true)

        done()
      })
  })

  it('should update trainer name', done => {
    const data = { name: 'bu' }
    request(server)
      .put('/trainer')
      .set('Authorization', token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.message, 'Profile information updated.')
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 0)
        assert.equal(res.body.user.balance, 1000)
        assert.equal(res.body.user.emailConfirmed, true)
        assert.equal(res.body.user.name, data.name)

        done()
      })
  })

  it('should update trainer pokemons', done => {
    const data = { pokemonId: '5963c5ac38f6f1e52aa68fe2' }
    request(server)
      .put('/trainer')
      .set('Authorization', token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.message, 'Profile information updated.')
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 1)
        assert.equal(res.body.user.balance, 1000)
        assert.equal(res.body.user.emailConfirmed, true)

        done()
      })
  })

  it('should update trainer when capture a pokemon', done => {
    const data = {
      pokemonId: '5963c5ac38f6f1e52aa68fe2',
      type: 'pokeball',
      capture: true
    }
    request(server)
      .put('/trainer')
      .set('Authorization', token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.message, 'Profile information updated.')
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 2)
        assert.equal(res.body.user.balance, 1000)
        assert.equal(res.body.user.emailConfirmed, true)
        assert.equal(res.body.user.bag[0].quantity, 9)

        done()
      })
  })

  it('should update trainer when sell a pokeball', done => {
    const data = {
      type: 'pokeball',
      sell: true
    }
    request(server)
      .put('/trainer')
      .set('Authorization', token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.message, 'Profile information updated.')
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 2)
        assert.equal(res.body.user.balance, 1100)
        assert.equal(res.body.user.emailConfirmed, true)
        assert.equal(res.body.user.bag[0].quantity, 8)

        done()
      })
  })

  it('should update trainer when buy a pokeball', done => {
    const data = {
      type: 'pokeball',
      buy: true
    }
    request(server)
      .put('/trainer')
      .set('Authorization', token)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body.message, 'Profile information updated.')
        assert.equal(res.body.user.bag.length, 4)
        assert.equal(res.body.user.pokemons.length, 2)
        assert.equal(res.body.user.balance, 900)
        assert.equal(res.body.user.emailConfirmed, true)
        assert.equal(res.body.user.bag[0].quantity, 9)

        done()
      })
  })
})
