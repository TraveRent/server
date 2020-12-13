const { sign, verify } = require('jsonwebtoken')

const jwtSign = (payload) => {
  return sign(payload, process.env.JWT_SECRET_KEY)
}

const jwtVerify = (accessToken) => {
  return verify(accessToken, process.env.JWT_SECRET_KEY)
}

module.exports = {
  jwtSign,
  jwtVerify
}