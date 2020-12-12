const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const app = require("../app");

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
          expect(status).to.have.statusCode(200);
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
            expect(status).to.have.statusCode(401);
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
            expect(status).to.have.statusCode(401);
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
            expect(status).to.have.statusCode(401);
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
            expect(status).to.have.statusCode(401);
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
            expect(status).to.have.statusCode(401);
            expect(body).to.have.property("error", "Wrong password");
            done();
          })
          .catch(done);
      });
    });
  });
});
