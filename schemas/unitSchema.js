const { Schema } = require('mongoose')

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
  }
}, { timestamps: true })

module.exports = unitSchema