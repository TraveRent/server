require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../var/www')
const {
  jsonwebtoken: {
    jwtSign
  }
} = require('../helpers')

// * Use Chai Plugin
chai.use(chaiHttp)

// * mongoose
const { Vendor, Unit } = require('../models')

// * Temporary data
let vendorId = ''
let localStorage = {
  accessToken: ''
}

// * Create a new vendor and login
before((done) => {
  const newVendor = new Vendor({
    firstName: 'Hacktiv8 Unit Test',
    lastName: 'Admin',
    email: 'unittest@mail.com',
    password: 'hacktiv8'
  })

  newVendor.save()
    .then(({ _id }) => {
      vendorId = _id
      localStorage.accessToken = jwtSign({ _id:_id, email: 'unittest@mail.com' })
      done()
    })
    .catch(done)
})

// * Cleanup Vendor and all Units
after((done) => {
  Unit.deleteMany({}, (err) => {
    if(err) {
      done(err)
    } else {
      Vendor.deleteOne({ _id: vendorId }, (err) => err ? done(err) : done())
    }
  })
})

// * Vendor Input Data Unit
describe('Vendor Input Data Unit', () => {
  describe('POST /units/add', () => {
    it('Should be success input', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          const { year } = body
          expect(res).to.have.status(201)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('_id', 'name', 'brand', 'type', 'year', 'category', 'createdAt', 'updatedAt', '__v')
          expect(body).to.have.property('_id')
          expect(body).to.have.property('name', newUnit.name)
          expect(body).to.have.property('brand', newUnit.brand)
          expect(body).to.have.property('type', newUnit.type)
          expect(year).to.equal(2020)
          expect(body).to.have.property('year', +newUnit.year)
          expect(body).to.have.property('category', newUnit.category)
          expect(body).to.have.property('createdAt')
          expect(body).to.have.property('updatedAt')
          expect(body).to.have.property('__v')
          done()
        })
        .catch(done)
    })

    it('Should be error if name of unit is empty', (done) => {
      const newUnit = {
        name: '',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Name cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if brand of unit is empty', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: '',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Brand cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if type of unit is empty', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: '',
        year: '2020',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Type cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if year of unit is empty', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Year cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if type of unit is not a number', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: 'two thousand eight',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Please double check your input and try again...')
          done()
        })
        .catch(done)
    })

    it('Should be error if category of unit is empty', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: 'two thousand eight',
        category: ''
      }

      chai.request(app)
        .post('/units/add')
        .set('access_token', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Category cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if vendor not login', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Car'
      }

      chai.request(app)
        .post('/units/add')
        .send(newUnit)
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