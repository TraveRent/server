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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
          expect(body).to.have.all.keys('_id', 'name', 'brand', 'type', 'year', 'category', 'imageUrl', 'createdAt', 'updatedAt', '__v')
          expect(body).to.have.property('_id')
          expect(body).to.have.property('name', newUnit.name)
          expect(body).to.have.property('brand', newUnit.brand)
          expect(body).to.have.property('type', newUnit.type)
          expect(year).to.equal(2020)
          expect(body).to.have.property('year', +newUnit.year)
          expect(body).to.have.property('category', newUnit.category)
          expect(body).to.have.property('imageUrl', newUnit.imageUrl)
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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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
        year: '2020',
        category: '',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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

    it('Should be error if imageUrl is empty', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Mobil Pribadi',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
      }

      chai.request(app)
        .post('/units/add')
        .set('accessToken', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          // * Your code here
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('messaage', 'ImageURL cannot be empty')
          done()
        })
        .catch(done)
    })

    it('Should be error if input imageUrl is invalid', (done) => {
      const newUnit = {
        name: 'Honda Civic Type-R',
        brand: 'Honda',
        type: 'Civic Type-R',
        year: '2020',
        category: 'Mobil Pribadi',
        imageUrl: 'image.jpg'
      }

      chai.request(app)
        .post('/units/add')
        .set('accessToken', localStorage.accessToken)
        .send(newUnit)
        .then(res => {
          // * Your code here
          const { body } = res
          expect(res).to.have.status(400)
          expect(body).to.be.an('object')
          expect(body).to.have.all.keys('message')
          expect(body).to.have.property('message', 'Input should be a valid URL')
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
        category: 'Car',
        imageUrl: 'https://imgx.gridoto.com/crop/0x0:0x0/700x465/filters:watermark(file/2017/gridoto/img/watermark_otoseken.png,5,5,60)/photo/2020/02/13/456583938.jpeg'
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

// ! Tests still needs to resolve
// * Vendor Input Data Unit
describe("Test endpoint edit data", () => {
  describe('PUT /units/:vendorId', () => {
    let unitId
    before((done) => {
      const unit = {
        name: 'Mitsubishi Xpander',
        brand: 'Mitsubishi',
        type: 'Otomatis',
        year: '2019',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      }
      Vendor.insertOne(unit)
      .then( data => {
        unitId = data._id
        done()
      })
      .catch( err => {
        done(err)
      })
    })
    //Success edit unit
    it('Test success edit', (done) => {
      chai
        .request(app)
        .put(`/units/${unitId}`)
        .set('accessToken', localStorage.accessToken)
        .send({
          name: 'Mitsubishi Xpander Sport',
          brand: 'Mitsubishi',
          type: 'Automatic',
          year: '2019',
          category: 'Mobil Penumpang',
          imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
        })
        .then( res => {
          const { body, status } = res
          expect(status).to.equal(200)
          expect(body).to.have.property('_id', expect.any(String))
          expect(body).to.have.property('name', 'Mitsubishi Xpander Sport')
          expect(body).to.have.property('brand', 'Mitsubishi')
          expect(body).to.have.property('type', 'Automatic')
          expect(body).to.have.property('year', '2019')
          expect(body).to.have.property('category', 'Mobil Penumpang')
          expect(body).to.have.property('imageUrl', 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg')
          expect(body).to.have.property('vendorId', 1)
          done()
        })
    })

    it('Test edit but name is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: '',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but brand is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: '',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but type is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: '',
        year: '2019',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but year is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but category is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: '',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but imgaeUrl is empty', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Car',
        imageUrl: ''
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but vendors not authorized', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(401)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test edit but vendors not login', (done) => {
      chai
      .request(app)
      .put(`/units/${unitId}`)
      .send({
        name: 'Mitsubishi Xpander Sport',
        brand: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })
  })
})


describe("Test endpoint delete data", () => {
  describe("DELETE /units/:vendorId", () => {
    let unitId
    before((done) => {
      let unit = {
        name: 'Toyota Rush',
        brand: 'Toyota',
        type: 'Manual',
        year: '2018',
        category: 'Mobil Penumpang',
        imageUrl: 'https://d2pa5gi5n2e1an.cloudfront.net/id/images/car_models/Mitsubishi_Xpander/1/exterior/exterior_2L_1.jpg'
      }
      Vendor.insertOne(unit)
      .then( data => {
        unitId = data._id
        done()
      })
      .catch( err => {
        done(err)
      })
    })

    it('Test success delete', (done) => {
      chai
      .request(app)
      .delete(`/units/${unitId}`)
      .set('accessToken', localStorage.accessToken)
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(200)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test delete but data not found', (done) => {
      chai
      .request(app)
      .delete(`/units/100`)
      .set('accessToken', localStorage.accessToken)
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(200)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test delete but vendors not authorized', (done) => {
      chai
      .request(app)
      .delete(`/units/${unitId}`)
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(200)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })

    it('Test delete but vendors not login', (done) => {
      chai
      .request(app)
      .delete(`/units/${unitId}`)
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(200)
        expect(body).to.have.all.keys("message")
        done()
      })
      .catch(done)
    })  
  })
})
