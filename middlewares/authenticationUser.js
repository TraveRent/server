const {
  jsonwebtoken: {
    jwtVerify
  }
} = require('../helpers')
const { isJWT } = require('validator')
const { User } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers

    if(!access_token) throw new Error('Unauthorized')
    if(!isJWT(access_token)) throw new Error('Invalid Access Token')

    const loggedIn = jwtVerify(access_token)
    if(!loggedIn) throw new Error('Unauthorized') // ! Coverage 14-20

    const checkUser = await User.findById(loggedIn._id)
    if(!checkUser) throw new Error('Unauthorized')
    req.whoAmI = loggedIn
    next()
  } catch (error) {
    next(error)
  }
}