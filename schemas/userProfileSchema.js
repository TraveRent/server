const { Schema } = require('mongoose')
const { isEmail, isMobilePhone, isURL } = require('validator')

const userProfileSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Fullname cannot be empty']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number cannot be empty'],
    validate: [isMobilePhone, 'Input should be a phone number']
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    validate: [isEmail, 'Input should be an email']
  },
  imageKTP: {
    type: String,
    required: [true, 'Please upload KTP image'],
    validate: [isURL, 'Input should be a valid URL']
  },
  imageSIM: {
    type: String,
    required: [true, 'Please upload SIM image'],
    validate: [isURL, 'Input should be a valid URL']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })


module.exports = userProfileSchema
