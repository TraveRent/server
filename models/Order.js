const { model } = require('mongoose')
const { orderSchema } = require('../schemas')

const Order = model('Order', orderSchema)

module.exports = Order