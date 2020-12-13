const router = require('express').Router()
const { UnitController } = require('../controllers')

const { authentication } = require('../middlewares')

router.use(authentication)
router.get('/', UnitController.getAllUnit)
router.post('/add', UnitController.postAddVendorUnit)
router.put('/:id', UnitController.editUnitById)
router.delete('/:id', UnitController.deleteUnitById)

module.exports = router