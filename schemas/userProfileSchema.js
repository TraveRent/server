const { Schema } = require('mongoose')
const { isEmail, isMobilePhone } = require('validator')

const userProfileSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Fullname cannot be empty']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number cannot be empty'],
    validate: [isMobilePhone, 'Invalid Phone Number']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty'],
    validate: [isEmail, 'Input should be an email']
  },
  imageKTP: {
    type: String,
    required: [true, 'Please upload KTP image']
  },
  imageSIM: {
    type: String,
    required: [true, 'Please upload SIM image']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })


module.exports = userProfileSchema