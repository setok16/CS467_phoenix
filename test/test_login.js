require('dotenv').config();
var app = require('../app.js');
var login = require('../routes/login.js');
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Login', function () {
 
  describe('/login', function() {

    it('should return a 404 (User not found) if the email address is not found', function(done) {
      let credentials = {
        email: 'non_existing@email.com',
        password: 'password'
      };
      chai.request(app)
      .post('/login')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });

    it('should return a 401 (Incorrect Password) if the password is incorrect', function(done) {
      let credentials = {
        email: process.env.EXISTING_BASIC_EMAIL,
        password: 'password'
      }
      chai.request(app)
      .post('/login')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });

    it('should return a 200 (Login success) if the email exists and the password is correct', function(done) {
      let credentials = {
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS
      }
      chai.request(app)
      .post('/login')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

  });

});
