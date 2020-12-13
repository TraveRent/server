const { model } = require('mongoose')
const { unitSchema } = require('../schemas')

const Unit = model('Unit', unitSchema)

module.exports = Unit