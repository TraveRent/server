const {
  jsonwebtoken: {
    jwtVerify
  }
} = require('../helpers')
const { isJWT } = require('validator')
const { Vendor } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { vendor_access_token } = req.headers

    if(!vendor_access_token) throw new Error('Unauthorized')
    if(!isJWT(vendor_access_token)) throw new Error('Invalid Access Token')

    const loggedIn = jwtVerify(vendor_access_token)

    const checkVendor = await Vendor.findById(loggedIn._id)
    if(!checkVendor) throw new Error('Unauthorized')
    req.whoAmI = loggedIn
    next()
  } catch (err) {
    next(err)
  }
}