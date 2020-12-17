const router = require('express').Router()
const { OrderController } = require('../controllers')

const { authenticationUser } = require('../middlewares')

router.get('/', OrderController.getOrder)
router.use(authenticationUser)
router.post('/', OrderController.saveOrder)

module.exports = router