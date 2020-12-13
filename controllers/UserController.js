const { User } = require('../models')
const { isEmail } = require('validator')
const {
  bcrypt: {
    verifyPassword
  },
  jsonwebtoken: {
    jwtSign
  }
} = require('../helpers')

class UserController {
  static async userRegister(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      })
      const { _id } = await newUser.save()
      res.status(201).json({ _id, email })
    } catch (error) {
      next(error)
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body
      if(!email) {
        throw new Error( 'Email cannot be empty' )
      }
      if(!password) {
        throw new Error( 'Password cannot be empty' )
      }
      if(!isEmail(email)) {
        throw new Error( 'Input should be an email' )
      }
      
      const findUser = await User.findOne({ email: email })
      if(!findUser) {
        throw new Error( 'Wrong email or password' )
      }
      if(!verifyPassword(password, findUser.password)) {
        throw new Error( 'Wrong email or password' )
      }

      const accessToken = jwtSign({
        _id: findUser._id,
        email: findUser.email
      })

      res.status(200).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController