const { Vendor } = require('../models')
const { isEmail } = require('validator')
const {
  bcrypt: {
    verifyPassword
  },
  jsonwebtoken: {
    jwtSign
  },
} = require('../helpers')

module.exports = class VendorController {
  static async postVendorRegister(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body
      const newVendor = new Vendor({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      })

      const { _id } = await newVendor.save()

      res.status(201).json({ _id, email })
    } catch (err) {
      next(err)
    }
  }

  static async postVendorLogin(req, res, next) {
    try {
      const { email, password } = req.body
      if(!email) throw new Error('Email cannot be empty')
      if(!password) throw new Error('Password cannot be empty')
      if(!isEmail(email)) throw new Error('Input should be an email')

      const findVendor = await Vendor.findOne({ email: email })

      if(!findVendor) throw new Error('Wrong email or password')
      if(!verifyPassword(password, findVendor.password)) throw new Error('Wrong email or password')

      const accessToken = jwtSign({
        _id: findVendor._id,
        email: findVendor.email
      })

      res.status(200).json({ accessToken })
    } catch (err) {
      next(err)
    }
  }
}
