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

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

Pokemon.findOneSync = Promise.promisify(Pokemon.findOne)
Pokemon.findSync = Promise.promisify(Pokemon.find)
Pokemon.findByIdSync = Promise.promisify(Pokemon.findById)

module.exports = Pokemon
