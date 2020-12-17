require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../var/www')
const fs = require('fs')
const path = require('path')

// * Use Chai Plugin
chai.use(chaiHttp)

// * mongoose
const { User, UserProfile } = require('../models')
const {
  jsonwebtoken: {
    jwtSign
  }
} = require('../helpers')

// * Temporary data
let userId = ''
let localStorage = {
  accessToken: '',
  expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5ZjkxYmFmZjY4NDhlYmYwNGU1ZTQiLCJlbWFpbCI6ImFrYmFyQG1haWwuY29tIiwiaWF0IjoxNjA4MTIwNjA0fQ.d5fh6_MHIbcmtZWYVHiVM4KRiXXC94O-sB0tWOzrHl0',
  invalidSecretToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5ZjViYzQ5YzE0NjhjYTc2ZWVjY2QiLCJlbWFpbCI6ImFrYmFyQG1haWwuY29tIiwiaWF0IjoxNjA4MTE5NzQxfQ.HiCADWzsu0IhNE9-bAyQTbJSI-bpXLxvThMOyFwlQSQ'
}

// * Before
before((done) => {
  const newUser = new User({
    firstName: 'Test',
    lastName: 'Login',
    email: 'akbar@mail.com',
    password: 'hacktiv8'
  })

  newUser.save()
    .then(({ _id }) => {
      userId = _id
      localStorage.accessToken = jwtSign({ _id: _id, email: 'akbar@mail.com' })
      done()
    })
    .catch(done)
})

after((done) => {
  UserProfile.deleteMany({}, (err) => {
    if(err) {
      done(err)
    } else {
      User.deleteMany({}, (err) => err ? done(err) : done())
    }
  })
})

// * User Input UserProfile
describe('UserProfile Add', () => {
  describe('POST /profiles', () => {
    it('Should be success add UserProfile', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(201)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('_id', 'fullName', 'phoneNumber', 'email', 'imageKTP', 'imageSIM', 'user', 'createdAt', 'updatedAt', '__v')
          expect(body).to.have.property('_id')
          expect(body).to.have.property('fullName', newUserProfile.fullName)
          expect(body).to.have.property('phoneNumber', newUserProfile.phoneNumber)
          expect(body).to.have.property('email', newUserProfile.email)
          expect(body).to.have.property('imageKTP')
          expect(body).to.have.property('imageSIM')
          expect(body).to.have.property('user')
          expect(body).to.have.property('createdAt')
          expect(body).to.have.property('updatedAt')
          expect(body).to.have.property('__v')
          done()
        })
        .catch(done)
    })

    it('Should be error if fullname of userProfile is empty', (done) => {
      const newUserProfile = {
        fullName: '',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Fullname cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if phoneNumber of userProfile is empty', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Phone number cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if input phoneNumber is invalid', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+620111',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Input should be a phone number')
          done()
        })
        .catch(done)
    })

    it('Should be error if email of userProfile is empty', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: ''
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Email cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if input email is invalid', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbar.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Input should be an email')
          done()
        })
        .catch(done)
    })

    it('Should be error if imageSIM is empty', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Please input your image')
          done()
        })
        .catch(done)
    })

    it('Should be error if imageKTP is empty', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Please input your image')
          done()
        })
        .catch(done)
    })

    it('Should be error if both of imageKTP and imageSIM is empty', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Please input your image')
          done()
        })
        .catch(done)
    })

    it('Should be error if imageKTP filesize is too large', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp10mb.jpg')), 'ktp10mb.jpg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(413)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'File too large')
          done()
        })
        .catch(done)
    })

    it('Should be error if imageSIM filesize is too large', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim10mb.jpg')), 'sim10mb.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(413)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'File too large')
          done()
        })
        .catch(done)
    })

    it('Should be error if both of imageKTP and imageSIM filesize is too large', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.accessToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp10mb.jpg')), 'ktp10mb.jpg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim10mb.jpg')), 'sim10mb.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(413)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'File too large')
          done()
        })
        .catch(done)
    })

    it('Should be error if access_token is not a valid JWT Token', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', '4kkjkdd33')
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(401)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Invalid Access Token')
          done()
        })
        .catch(done)
    })

    it('Should be error if user sent invalid JWT Signature', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.invalidSecretToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(401)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'invalid signature')
          done()
        })
        .catch(done)
    })

    it('Should be error if user sent deleted User Token', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .set('access_token', localStorage.expiredToken)
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(401)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Unauthorized')
          done()
        })
        .catch(done)
    })

    it('Should be error if user is not login', (done) => {
      const newUserProfile = {
        fullName: 'Muhammad Akbar',
        phoneNumber: '+6281318356925',
        email: 'akbarhabiby@icloud.com'
      }

      chai.request(app)
        .post('/profiles')
        .field('fullName', newUserProfile.fullName)
        .field('phoneNumber', newUserProfile.phoneNumber)
        .field('email', newUserProfile.email)
        .attach('imageKTP', fs.readFileSync(path.join(__dirname + '/img/ktp.jpeg')), 'ktp.jpeg')
        .attach('imageSIM', fs.readFileSync(path.join(__dirname + '/img/sim.jpg')), 'sim.jpg')
        .then(res => {
          const { body } = res
          expect(res).to.have.status(401)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Unauthorized')
          done()
        })
        .catch(done)
    })
  })
})

describe('UserProfile GET', () => {
  describe('GET /profiles', () => {
    it('Should be get all user profiles', (done) => {
      chai.request(app)
        .get('/profiles')
        .set('access_token', localStorage.accessToken)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(200)
          expect(body).to.be.an('array')
          done()
        })
        .catch(done)
    })
  })
})