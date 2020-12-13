const { Schema } = require('mongoose')
const { isEmail } = require('validator')

const {
  bcrypt: {
    encryptPassword
  }
} = require('../helpers')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name cannot be empty']
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty'],
    validate: [isEmail, 'Input should be an email']
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty'],
    minlength: [6, 'Password must have at least six characters']
  }
}, { timestamps: true })

userSchema.pre('validate', function(next) {
  if(!this.lastName) {
    this.lastName = this.firstName
  }
  next()
})

userSchema.pre('save', function (next) {
  this.password = encryptPassword(this.password)
  next()
})

module.exports = userSchema