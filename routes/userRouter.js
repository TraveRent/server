const { UserController } = require('../controllers')
const router = require('express').Router()

router.post('/register', UserController.userRegister)
router.post('/login', UserController.userLogin)

module.exports = router