const {
  jsonwebtoken: {
    jwtVerify
  }
} = require('../helpers')
const { Vendor } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers

    if(!access_token) throw new Error('Unauthorized')
    const loggedIn = jwtVerify(access_token)
    if(!loggedIn) throw new Error('Unauthorized')

    const checkVendor = await Vendor.findById(loggedIn._id)

    if(!checkVendor) throw new Error('Unauthorized')
    req.whoAmI = jwtVerify(access_token)
    next()
  } catch (err) {
    next(err)
  }
}