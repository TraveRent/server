const router = require('express').Router()

const vendorRouter = require('./vendorRouter')
const unitRouter = require('./unitRouter')
const userRouter = require('./userRouter')

router.use('/vendors', vendorRouter)
router.use('/units', unitRouter)
router.use('/users', userRouter)

module.exports = router