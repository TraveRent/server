const { model } = require('mongoose')
const { vendorSchema } = require('../schemas')

const Vendor = model('Vendor', vendorSchema)

module.exports = Vendor