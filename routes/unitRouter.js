const router = require('express').Router()
const { UnitController } = require('../controllers')

const { authentication } = require('../middlewares')

router.use(authentication)
router.post('/add', UnitController.postAddVendorUnit)

module.exports = router