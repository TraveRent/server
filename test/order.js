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
const { User, UserProfile, Unit, Vendor } = require('../models')
const {
  jsonwebtoken: {
    jwtSign
  }
} = require('../helpers')

// * Temporary data
let temp = {}
let localStorage = {
  accessToken: '',
  expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5ZjkxYmFmZjY4NDhlYmYwNGU1ZTQiLCJlbWFpbCI6ImFrYmFyQG1haWwuY29tIiwiaWF0IjoxNjA4MTIwNjA0fQ.d5fh6_MHIbcmtZWYVHiVM4KRiXXC94O-sB0tWOzrHl0',
  invalidSecretToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmQ5ZjViYzQ5YzE0NjhjYTc2ZWVjY2QiLCJlbWFpbCI6ImFrYmFyQG1haWwuY29tIiwiaWF0IjoxNjA4MTE5NzQxfQ.HiCADWzsu0IhNE9-bAyQTbJSI-bpXLxvThMOyFwlQSQ'
}

// * Before
before(async (done) => {
  try {
    const newVendor = new Vendor({
      firstName: 'Hacktiv8 Unit Test',
      lastName: 'Admin',
      email: 'unittest@mail.com',
      password: 'hacktiv8'
    })
    const { _id: vendorId_new } = await newVendor.save()

    const newUnit = new Unit({
      name: 'Mitsubishi Xpander',
      brand: 'Mitsubishi',
      type: 'Otomatis',
      year: '2019',
      category: 'Mobil Penumpang',
      imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg',
      price: '90000000',
      location: 'Jakarta',
      vendor: vendorId_new
    })
  
    const { _id: unitId_new } = await newUnit.save()

    const newUser = new User({
      firstName: 'Test',
      lastName: 'Login',
      email: 'akbar@mail.com',
      password: 'hacktiv8'
    })
    const { _id: userId_new } = await newUser.save()

    const newUserProfile = new UserProfile({
      fullName: 'Muhammad Akbar',
      phoneNumber: '+6281318356925',
      email: 'akbarhabiby@icloud.com',
      imageKTP: '',
      imageSIM: '',
      user: userId_new
    })
    const { _id: userProfileId_new } = await newUserProfile.save()

    temp.userId = userId_new
    temp.unitId = unitId_new
    temp.vendorId = vendorId_new
    temp.userProfileId = userProfileId_new

    localStorage.accessToken = jwtSign({ _id: userId_new, email: 'akbar@mail.com' })

    done()
  } catch (err) {
    done(err)
  }
})

// * Input Order
describe('User Input Order', () => {
  describe('POST /orders', () => {
    it('Should be success Input Order', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.userProfileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(201)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('_id', 'user', 'startDate', 'endDate', 'unit', 'vendor', 'userProfile', 'createdAt', 'updatedAt', '__v')
          expect(body).to.have.property('_id')
          expect(body).to.have.property('user', temp.userId)
          expect(body).to.have.property('startDate', newOrder.startDate)
          expect(body).to.have.property('endDate', newOrder.endDate)
          expect(body).to.have.property('unit', temp.unitId)
          expect(body).to.have.property('vendor', temp.vendorId)
          expect(body).to.have.property('userProfile', temp.userProfileId)
          expect(body).to.have.property('createdAt')
          expect(body).to.have.property('updatedAt')
          expect(body).to.have.property('__v')
          done()
        })
        .catch(done)
    })

    it('Should be error if unitId is empty', (done) => {
      const newOrder = {
        unitId: '',
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.userProfileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'UnitId cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if vendorId is empty', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: '',
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.userProfileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'VendorId cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if startDate is empty', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temo.vendorId,
        startDate: '',
        endDate: new Date('2020-12-09'),
        profileId: temp.userProfileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Start date cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if endDate is empty', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: '',
        profileId: temp.userProfileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Start date cannot be empty')
          done()
        })
        .catch(done)
    })

    // !!!!!!!!!
    it('Should be error if profileId is empty', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: ''
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'VendorId cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if access_token is not a valid JWT Token', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.profileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.accessToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Invalid Access Token')
          done()
        })
        .catch(done)
    })

    it('Should be error if user sent invalid JWT Signature', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.profileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.invalidSecretToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'invalid signature')
          done()
        })
        .catch(done)
    })

    it('Should be error if user sent deleted User Token', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.profileId
      }
      chai.request(app)
        .post('/orders')
        .set('access_token', localStorage.expiredToken)
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Unauthorized')
          done()
        })
        .catch(done)
    })

    it('Should be error if user is not login', (done) => {
      const newOrder = {
        unitId: temp.unitId,
        vendorId: temp.vendorId,
        startDate: new Date('2020-11-09'),
        endDate: new Date('2020-12-09'),
        profileId: temp.profileId
      }
      chai.request(app)
        .post('/orders')
        .send(newOrder)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Unauthorized')
          done()
        })
        .catch(done)
    })
  })
})

// * Get Order
describe('User Get Order', () => {
  describe('GET /orders', () => {
    it('Should be success GET all Orders', (done) => {
      chai.request(app)
        .get('/orders')
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

after((done) => {
  UserProfile.deleteMany({}, (err) => {
    if(err) {
      done(err)
    } else {
      User.deleteMany({}, (err) => {
        if(err) {
          done(err)
        } else {
          Unit.deleteMany({}, (err) => {
            if(err) {
              done(err)
            } else {
              User.deleteMany({}, (err) => {
                if(err) {
                  done(err)
                } else {
                  done()
                }
              })
            }
          })
        }
      })
    }
  })
})
