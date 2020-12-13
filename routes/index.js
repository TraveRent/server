const router = require('express').Router()

const vendorRouter = require('./vendorRouter')
const unitRouter = require('./unitRouter')

router.use('/vendors', vendorRouter)
router.use('/units', unitRouter)

module.exports = router