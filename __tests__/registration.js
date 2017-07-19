'use strict'

const assert = require('assert')
const request = require('supertest')

const server = require('./../server')
const resetDb = require('./../lib/helpers/reset-db')
const TokenModel = require('./../lib/models/token')

describe('registration', () => {
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
        assert.equal(res.body.user.balance, 5000)
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
})
