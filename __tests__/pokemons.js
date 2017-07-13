'use strict'

const assert = require('assert')
const request = require('supertest')

const server = require('./../server')
const resetDb = require('./../lib/helpers/reset-db')

describe('pokemons', () => {
  before(done => {
    resetDb().then(done).catch(done)
  })

  it('should get all pokemons', done => {
    request(server).get('/pokemons').expect(200).end((err, res) => {
      if (err) {
        console.error(res.error)
        return done(err)
      }

      assert.ok(res.body.pokemons)

      done()
    })
  })
})
