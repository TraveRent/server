require('dotenv').config()
const chai = require('chai')
const app = require('../var/www')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

const { User } = require('../models')

after((done) => {
  User.deleteMany({}, (err) => err ? done(err) : done())
})

describe("Test User Register", () => {
  describe("POST /users/register", () => {
    it.only('User success register', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: 'Farhan',
        lastName: 'Haryawan',
        email: 'farhan@mail.com',
        password: '12345678',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(201)
        expect(body).to.be.an('object')
        expect(body).to.have.all.keys('_id', 'email')
        expect(body).to.have.property('email', 'farhan@mail.com')
        done()
      })
      .catch(done)
    })
  })

  describe("POST /users/register", () => {
    it('Test register but first name is empty', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: '',
        lastName: 'Haryawan',
        email: 'farhan@mail.com',
        password: '12345678',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys('message')
        done()
      })
      .catch(done)
    })
  
    it('Test register but email is empty', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: 'Farhan',
        lastName: 'Haryawan',
        email: '',
        password: '12345678',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys('message')
        done()
      })
      .catch(done)
    })
  
    it('Test register but email is invalid', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: 'Farhan',
        lastName: 'Haryawan',
        email: 'farhan@mail.c',
        password: '12345678',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys('message')
        done()
      })
      .catch(done)
    })
  
    it('Test register but password is empty', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: 'Farhan',
        lastName: 'Haryawan',
        email: 'farhan@mail.com',
        password: '',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys('message')
        done()
      })
      .catch(done)
    })
  
    it('Test register but password length less than 6 characters', (done) => {
      chai
      .request(app)
      .post('/users/register')
      .send({
        firstName: 'Farhan',
        lastName: 'Haryawan',
        email: 'farhan@mail.com',
        password: '1234',
      })
      .then( res => {
        const { body, status } = res
        expect(status).to.equal(400)
        expect(body).to.have.all.keys('message')
        done()
      })
      .catch(done)
    })
  })
})

describe("Test For User Login", () => {
  describe("POST /users/login", () => {
    it("User Success Login", (done) => {
      chai
        .request(app)
        .post("/users/login")
        .send({
          email: "ftrahl@gmail.com",
          password: "hacktiv8",
        })
        .then((res) => {
          const { body, status } = res;
          expect(status).to.equal(200);
          expect(body).to.be.an("object");
          expext(body).to.have.all.keys("email");
          expect(body).to.have.all.keys("accessToken");
          done();
        })
        .catch(done);
    });
    describe("User Login Fails", () => {
      it("User Login with empty email", (done) => {
        chai
          .request(app)
          .post("/users/login")
          .send({
            email: "",
            password: "hacktiv8",
          })
          .then((res) => {
            const { body, status } = res;
            expect(status).to.equal(401);
            expect(body).to.have.property("error", "Email cannot be blank");
            done();
          })
          .catch(done);
      });
      it("User Login with invalid email", (done) => {
        chai
          .request(app)
          .post("/users/login")
          .send({
            email: "ftrahl@gmailcom",
            password: "hacktiv8",
          })
          .then((res) => {
            const { body, status } = res;
            expect(status).to.equal(401);
            expect(body).to.have.property("error", "Invalid Email");
            done();
          })
          .catch(done);
      });
      it("User Login with wrong email", (done) => {
        chai
          .request(app)
          .post("/users/login")
          .send({
            email: "ftrah@gmail.com",
            password: "hacktiv8",
          })
          .then((res) => {
            const { body, status } = res;
            expect(status).to.equal(401);
            expect(body).to.have.property("error", "Wrong Email");
            done();
          })
          .catch(done);
      });
      it("User Login with empty password", (done) => {
        chai
          .request(app)
          .post("/users/login")
          .send({
            email: "ftrahl@gmail.com",
            password: "",
          })
          .then((res) => {
            const { body, status } = res;
            expect(status).to.equal(401);
            expect(body).to.have.property("error", "Password cannot be blank");
            done();
          })
          .catch(done);
      });
      it("User Login with wrong password", (done) => {
        chai
          .request(app)
          .post("/users/login")
          .send({
            email: "ftrahl@gmail.com",
            password: "hacktiv",
          })
          .then((res) => {
            const { body, status } = res;
            expect(status).to.equal(401);
            expect(body).to.have.property("error", "Wrong password");
            done();
          })
          .catch(done);
      });
    });
  });
});
