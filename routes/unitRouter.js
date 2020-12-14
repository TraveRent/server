const router = require('express').Router()
const { UnitController } = require('../controllers')

const { authentication, authorization } = require('../middlewares')

router.use(authentication)
router.get('/', UnitController.getAllVendorUnit)
router.post('/add', UnitController.postAddVendorUnit)
router.get('/:unitId', UnitController.getVendorUnitById)

router.use('/:unitId', authorization)
router.put('/:unitId', UnitController.putEditVendorUnitById)
router.delete('/:unitId', UnitController.deleteVendorUnitById)

module.exports = router