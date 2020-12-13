const { Schema } = require('mongoose')
const { isURL } = require('validator')

const unitSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty']
  },
  brand: {
    type: String,
    required: [true, 'Brand cannot be empty']
  },
  type: {
    type: String,
    required: [true, 'Type cannot be empty']
  },
  year: {
    type: Number,
    required: [true, 'Year cannot be empty']
  },
  category: {
    type: String,
    required: [true, 'Category cannot be empty']
  },
  imageUrl: {
    type: String,
    required: [true, 'ImageURL cannot be empty'],
    validate: [isURL, 'Input should be a valid URL']
  }
}, { timestamps: true })

module.exports = unitSchema