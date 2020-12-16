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

  if(err.message) { // ! Coverage ????
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
      case 'Invalid Access Token':
        message = err.message
        status = 401
        break
      case 'File too large':
        message = err.message
        status = 413
        break
      case `Cannot destructure property 'originalname' of 'undefined' as it is undefined.`:
        message = 'Please input your image'
        status = 400
        break
      case 'Please input your image':
        message = err.message
        status = 400
        break
      case 'invalid signature':
        message = err.message
        status = 401
        break
    }
  }

  if(err.message.includes('Cast to ObjectId failed')) {
    message = 'Unit not found'
    status = 404
  }

  res.status(status).json({ message })
}
