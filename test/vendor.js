let chai = require('chai')
const app = require('../app')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

let tokenAdmin
let tokenAdmin1

describe("Test endpoint edit data", () => {
  describe('PUT /vendors/:id', () => {
    let unitId
    before((done) => {
      let unit = {
        name: 'Mitsubishi Xpander',
        merk: 'Mitsubishi',
        type: 'Otomatis',
        year: '2019',
        category: 'Mobil Penumpang'
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
        .put(`/vendors/${unitId}`)
        .set('accessToken', tokenAdmin)
        .send({
          name: 'Mitsubishi Xpander Sport',
          merk: 'Mitsubishi',
          type: 'Automatic',
          year: '2019',
          category: 'Mobil Penumpang'
        })
        .then( res => {
          const { body, status } = res
          expect(status).to.equal(200)
          expect(body).to.have.property('_id', expect.any(String))
          expect(body).to.have.property('name', 'Mitsubishi Xpander Sport')
          expect(body).to.have.property('merk', 'Mitsubishi')
          expect(body).to.have.property('type', 'Automatic')
          expect(body).to.have.property('year', '2019')
          expect(body).to.have.property('category', 'Mobil Penumpang')
          done()
        })
        .catch(done)
    })

    it('Test edit but name is empty', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
      .send({
        name: '',
        merk: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil Penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Name cannot be empty')
        done()
      })
      .catch(done)
    })

    it('Test edit but merk is empty', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: '',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil Penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Merk cannot be empty')
        done()
      })
      .catch(done)
    })

    it('Test edit but type is empty', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: 'Mitsubishi',
        type: '',
        year: '2019',
        category: 'Mobil Penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Type cannot be empty')
        done()
      })
      .catch(done)
    })

    it('Test edit but year is empty', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: 'Mitsubishi',
        type: 'Automatic',
        year: '',
        category: 'Mobil Penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Year cannot be empty')
        done()
      })
      .catch(done)
    })

    it('Test edit but category is empty', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: ''
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Category cannot be empty')
        done()
      })
      .catch(done)
    })

    it('Test edit but vendors not authorized', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin1)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(401)
        expect(body).to.have.property('message', 'Not authorized')
        done()
      })
      .catch(done)
    })

    it('Test edit but vendors not login', (done) => {
      chai
      .request(app)
      .put(`/vendors/${unitId}`)
      .send({
        name: 'Mitsubishi Xpander Sport',
        merk: 'Mitsubishi',
        type: 'Automatic',
        year: '2019',
        category: 'Mobil penumpang'
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.property('message', 'Please login first')
        done()
      })
      .catch(done)
    })
  })
})

describe("Test endpoint delete data", () => {
  describe("DELETE /vendors/:id", () => {
    let unitId
    before((done) => {
      let unit = {
        name: 'Toyota Rush',
        merk: 'Toyota',
        type: 'Manual',
        year: '2018',
        category: 'Mobil Penumpang'
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
      .delete(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin)
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
      .delete(`/vendors/100`)
      .set('accessToken', tokenAdmin)
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
      .delete(`/vendors/${unitId}`)
      .set('accessToken', tokenAdmin1)
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
      .delete(`/vendors/${unitId}`)
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
