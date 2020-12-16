const router = require('express').Router()
const { UserProfileController } = require('../controllers')

const { authenticationUser } = require('../middlewares')
const { uploadUserProfileMiddleware } = require('../aws')

router.use(authenticationUser)
router.post('/', uploadUserProfileMiddleware, UserProfileController.saveProfile)
router.get('/', UserProfileController.getProfile)

// * Authorization?
// TODO add => router.use('/:profileId', authorizationUser)
// router.put('/:profileId', UserProfileController.editProfileById)
// router.delete('/:profileId', UserProfileController.deleteProfileById)

module.exports = router