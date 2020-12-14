const { model } = require('mongoose')
const { userProfileSchema } = require('../schemas')

const UserProfile = model('UserProfile', userProfileSchema)

module.exports = UserProfile