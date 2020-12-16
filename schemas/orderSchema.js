const { Schema } = require('mongoose')

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date cannot be empty']
  },
  endDate: {
    type: Date,
    required: [true, 'End date cannot be empty']
  },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile"
  }
}, { timestamps: true })

module.exports = orderSchema
