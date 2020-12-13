const { compareSync, hashSync, genSaltSync } = require('bcryptjs')

const encryptPassword = (urPassword) => {
  return hashSync(urPassword, genSaltSync(9))
}

const verifyPassword = (urPassword, dbPassword) => {
  return compareSync(urPassword, dbPassword)
}

module.exports = {
  encryptPassword,
  verifyPassword
}