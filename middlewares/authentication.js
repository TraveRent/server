const {
  jsonwebtoken: {
    jwtVerify
  }
} = require('../helpers')

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers

    if(!access_token) throw new Error('Unauthorized')
    if(!jwtVerify(access_token)) throw new Error('Unauthorized')

    next()
  } catch (err) {
    next(err)
  }
}