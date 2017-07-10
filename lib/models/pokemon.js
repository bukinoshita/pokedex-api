'use strict'

const mongoose = require('mongoose')
const Promise = require('bluebird')

const schemaOptions = {
  timestamps: true
}

const pokemonSchema = new mongoose.Schema(
  {
    pokedexNumber: Number,
    name: String,
    type: [String],
    genderRatio: {
      male: Number,
      female: Number
    },
    catchRate: Number,
    color: String,
    hp: Number,
    attack: Number,
    defense: Number,
    speedAttack: Number,
    speedDefense: Number,
    speed: Number,
    fleeRate: Number
  },
  schemaOptions
)

const pokemon = mongoose.model('Pokemon', pokemonSchema)

pokemon.findOneSync = Promise.promisify(pokemon.findOne)
pokemon.findSync = Promise.promisify(pokemon.find)
pokemon.findByIdSync = Promise.promisify(pokemon.findById)

module.exports = pokemon
