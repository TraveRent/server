const router = require('express').Router()

const vendorRouter = require('./vendorRouter')
const unitRouter = require('./unitRouter')
const userRouter = require('./userRouter')
const userProfileRouter = require('./userProfileRouter')
const orderRouter = require('./orderRouter')

router.use('/vendors', vendorRouter)
router.use('/units', unitRouter)
router.use('/users', userRouter)
router.use('/profiles', userProfileRouter)
router.use('/orders', orderRouter)

module.exports = router