require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../var/www')

// * Use Chai Plugin
chai.use(chaiHttp)

describe('GET Available Endpoints', () => {
  describe('GET /', () => {
    it('Should be return Available Endpoints', (done) => {
      chai.request(app)
        .get('/')
        .then(res => {
          expect(res).to.have.status(200)
          done()
        })
        .catch(done)
    })
  })
})