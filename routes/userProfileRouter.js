const { UserProfileController } = require('../controllers')
const router = require('express').Router()
const { authenticationUser } = require('../middlewares')

router.use(authenticationUser)
router.post('/', UserProfileController.saveProfile)
router.get('/', UserProfileController.getProfile)
router.put('/:profileId', UserProfileController.editProfileById)
router.delete('/:profileId', UserProfileController.deleteProfileById)

module.exports = router