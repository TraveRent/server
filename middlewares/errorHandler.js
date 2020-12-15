const { errorsJoin } = require('../helpers')

module.exports = (err, req, res, next) => {
  let message = 'Internal Server Error'
  let status = 500

  // * Unique Email Address
  if(err.code === 11000 && err.keyPattern.email) {
    message = 'Oopss.. Email is already taken'
    status = 400
  }

  // * Validation error
  if(err.errors) {
    message = errorsJoin(err.errors)
    status = 400
  }

  if(err.message) {
    switch(err.message) {
      case 'Wrong email or password':
        message = err.message
        status = 400
        break
      case 'Email cannot be empty':
        message = err.message
        status = 400
        break
      case 'Password cannot be empty':
        message = err.message
        status = 400
        break
      case 'Input should be an email':
        message = err.message
        status = 400
        break
      case 'Unauthorized':
        message = err.message
        status = 401
        break
      case 'Please complete all forms':
        message = err.message
        status = 400
        break
      case 'Unit not found':
        message = err.message
        status = 404
        break
      case 'Failed to upload image':
        message = err.message
        status = 406
        break
      case 'Invalid Access Token':
        message = err.message
        status = 401
        break
    }
  }

  res.status(status).json({ message })
}
