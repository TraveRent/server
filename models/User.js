const { model } = require('mongoose')
const { userSchema } = require('../schemas')

const User = model('User', userSchema)

module.exports = User