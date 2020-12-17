require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../var/www')

// * Use Chai Plugin
chai.use(chaiHttp)

// * mongoose
const { Vendor } = require('../models')

// * Create a main vendor for test
before((done) => {
  const newVendor = new Vendor({
    firstName: 'Hacktiv8 Test',
    lastName: 'Admin',
    email: 'test@mail.com',
    password: 'hacktiv8'
  })

  newVendor.save()
    .then(done())
    .catch(done)
})

// * Cleanup all Vendor
after((done) => {
  Vendor.deleteMany({}, (err) => err ? done(err) : done())
})

// * Vendor Register
describe('Vendor Register', () => {
  describe('POST /vendors/register', () => {
    it('Should be success register', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Akbar',
          lastName: '',
          email: 'akbarhabiby@icloud.com',
          password: 'hacktiv8'
      })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(201)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('_id', 'email')
          expect(body).to.have.property('email', 'akbarhabiby@icloud.com')
          done()
        })
        .catch(done)
    })

    it('Should be error if email is already used', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Another Test',
          lastName: 'Admin Test',
          email: 'test@mail.com',
          password: 'hacktiv8'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Oopss.. Email is already taken')
          done()
        })
        .catch(done)
    })

    it('Should be error if firstName empty', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: '',
          lastName: 'Habiby',
          email: 'akbar@mail.com',
          password: 'hacktiv8'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'First name cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if email is empty', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Akbar',
          lastName: 'Habiby',
          email: '',
          password: 'hacktiv8'
        })
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
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Akbar',
          lastName: 'Habiby',
          email: 'akbar.com',
          password: 'hacktiv8'
        })
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

    it('Should be error if password is empty', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Akbar',
          lastName: 'Habiby',
          email: 'akbar@mail.com',
          password: ''
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Password cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if password length is less than 6', (done) => {
      chai.request(app)
        .post('/vendors/register')
        .send({
          firstName: 'Akbar',
          lastName: 'Habiby',
          email: 'akbar@mail.com',
          password: 'h8ind'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Passwords must have at least 6 characters')
          done()
        })
        .catch(done)
    })
  })
})

// * Vendor Login
describe('Vendor Login', () => {
  describe('POST /vendors/login', () => {
    it('Should be success login', (done) => {
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: 'test@mail.com',
          password: 'hacktiv8'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(200)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('_id', 'accessToken', 'fullName')
          expect(body).to.have.property('_id')
          expect(body).to.have.property('accessToken')
          expect(body).to.have.property('fullName')
          done()
        })
        .catch(done)
    })

    it('Should be error if email is empty', (done) => {
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: '',
          password: 'hacktiv8'
        })
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
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: 'test.com',
          password: 'hacktiv8'
        })
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

    it('Should be error if password is empty', (done) => {
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: 'test@mail.com',
          password: ''
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Password cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if email is wrong', (done) => {
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: 'test1337@freemail.com',
          password: 'hacktiv8'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Wrong email or password')
          done()
        })
        .catch(done)
    })

    it('Should be error if password is wrong', (done) => {
      chai.request(app)
        .post('/vendors/login')
        .send({
          email: 'test@mail.com',
          password: 'hacktiv'
        })
        .then(res => {
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Wrong email or password')
          done()
        })
        .catch(done)
    })
  })
})
