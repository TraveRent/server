const router = require('express').Router()
const { VendorController } = require('../controllers')

router.post('/register', VendorController.postVendorRegister)
router.post('/login', VendorController.postVendorLogin)

module.exports = router