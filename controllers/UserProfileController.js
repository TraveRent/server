const { UserProfile } = require('../models')
const {
  s3AWSUploadImage
} = require('../aws')

class UserProfileController {
  static async saveProfile(req, res, next) {
    try {
      const {
        body: { fullName, phoneNumber, email },
        files: { imageKTP: [ktp], imageSIM: [sim] },
        whoAmI: { _id }
      } = req

      const urlImageKTP = await s3AWSUploadImage(ktp)
      const urlImageSIM = await s3AWSUploadImage(sim)

      const newFullName = fullName[0].toUpperCase() + fullName.substring(1)

      const newProfile = new UserProfile({
        fullName: newFullName,
        phoneNumber: phoneNumber,
        email: email,
        imageKTP: urlImageKTP,
        imageSIM: urlImageSIM,
        user: _id
      })

      const createNewProfile = await newProfile.save()
      res.status(201).json(createNewProfile)
    } catch (error) {
      next(error)
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { _id } = req.whoAmI
      const allProfile = await UserProfile.find({ user: _id }).populate('user')
      res.status(200).json(allProfile)
    } catch (error) {
      next(error)
    }
  }

  static async editProfileById(req, res, next) {
    try {
      const { profileId } = req.params
      const { fullName, phoneNumber, email, imageKTP, imageSIM } = req.body
      if(!fullName || !phoneNumber || !email || !imageKTP || !imageSIM)
        throw new Error('Please complete all forms')

      const updatedProfile = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        imageKTP: imageKTP,
        imageSIM: imageSIM
      }

      const { n } = await UserProfile.updateOne({ _id: profileId }, updatedProfile, { upsert: false })
      if( n === 0) throw new Error('Failed to edit profile')
      res.status(200).json({ message: 'Successfully edit your profile' })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProfileById(req, res, next) {
    try {
      const { profileId } = req.params
      const { n } = await UserProfile.deleteOne({ _id: profileId })
      if( n === 0) throw new Error ('Failed to delete profile')
      res.status(200).json({ message: 'Successfully delete your profile' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserProfileController