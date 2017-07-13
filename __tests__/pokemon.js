'use strict'

const assert = require('assert')
const request = require('supertest')

const server = require('./../server')
const resetDb = require('./../lib/helpers/reset-db')

describe('pokemon', () => {
  before(done => {
    resetDb().then(done).catch(done)
  })

  let pokemonId = null

  it('should create pokemon', done => {
    const data = {
      pokedexNumber: '001',
      name: 'Bulbasaur',
      type: ['grass', 'poison'],
      genderRatio: {
        male: 87.5,
        female: 12.5
      },
      catchRate: 45,
      color: 'green',
      hp: 45,
      attack: 49,
      defense: 49,
      speedAttack: 65,
      speedDefense: 65,
      speed: 45,
      fleeRate: 10
    }
    request(server).post('/pokemons').send(data).expect(200).end((err, res) => {
      if (err) {
        console.error(res.error)
        return done(err)
      }

      assert.equal(res.body.message, 'Pokemon was born')

      pokemonId = res.body.pokemon._id

      done()
    })
  })

  it('should get pokemon', done => {
    request(server)
      .get(`/pokemons/${pokemonId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(res.error)
          return done(err)
        }

        assert.equal(res.body._id, pokemonId)

        done()
      })
  })
})
