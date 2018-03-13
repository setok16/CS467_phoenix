require('dotenv').config();
var app = require('../app.js');
var user = require('../routes/users.js');
var should = require('chai').should();
var assert = require('chai').assert;
var generateName = require('sillyname');

var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var generatedName = generateName() + '';

var splitName = generatedName.split(" ");
var newName = {
  input_fname: splitName[0],
  input_lname: splitName[1]
};
var newPwd = 'Passw0rd';
var newEmail= 'testEmail@test.com';


describe('/users', function() {
  
  describe('/users', function() {

    it ('should return status code of 200 if user page renders', function(done) {
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .get('/users')
        .send()
        .then(function (res) {
          res.should.have.status(200);
          done();
        });
      });
    });

  });
  
  describe('/users/editName', function() {

    it ('should return status code of 200 if name is successfully changed', function(done) {

      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/editName')
        .send(newName)
        .then(function (res) {
          res.should.have.status(200);
          done();
        });
      });
    });

    it ('should have changed the name', function(done) {
        chai.request(app)
        .get('/api/users')
        .query({email: process.env.EXISTING_BASIC_EMAIL})
        .send()
        .end(function(err, res) {
          var user = JSON.parse(res.text)[0][0];
          var fname = user.fname;
          var lname = user.lname;
          res.should.have.status(200);
          assert.equal(user.fname, newName.input_fname);
          assert.equal(user.lname, newName.input_lname);
          done();
        });
    });

    it ('should return 400 if no names are specified', function(done) {

      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/editName')
        .send()
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });
      
    });
  });

  describe('/users/changePwd', function() {

    it ('should return 400 if passwords do not match', function(done) {
      var passwords = {
        input_pwd: 'P@ssw0rd',
        input_pwd_verify: 'P@ssw0rb'
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changePwd')
        .send(passwords)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });
    });

    it ('should return 400 if password does not meet requirements', function(done) {
      var passwords = {
        input_pwd: 'password',
        input_pwd_verify: 'password'
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changePwd')
        .send(passwords)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });
    });

    it ('should return 400 if passwords aren\'t specified', function(done) {
      var passwords = {
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changePwd')
        .send(passwords)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });
    });
    
    it ('should return status code of 200 if password is successfully changed', function(done) {
      var passwords = {
        input_pwd: newPwd,
        input_pwd_verify: newPwd
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changePwd')
        .send(passwords)
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
      });
    });

    it ('should allow login with new password after password change.', function(done) {
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: newPwd })
      .then(function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it ('should change the password back to the original', function(done) {
      var passwords = {
        input_pwd: process.env.EXISTING_BASIC_PASS,
        input_pwd_verify: process.env.EXISTING_BASIC_PASS
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: newPwd })
      .then(function(res) {
        agent
        .patch('/users/changePwd')
        .send(passwords)
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
      });
    });

  });

  describe('/users/changeEmail', function() {

    it ('should return 409 if email already exists', function(done) {
      var email = {
        input_email: process.env.EXISTING_BASIC_EMAIL
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changeEmail')
        .send(email)
        .end(function (err, res) {
          res.should.have.status(409);
          done();
        });
      });
    });

    it ('should return 400 if email has incorrect format' , function(done) {
      var email = {
        input_email: '12345'
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changeEmail')
        .send(email)
        .end(function (err, res) {
          res.should.have.status(400);
          done();
        });
      });
    });

    it ('should return 200 if email is successfully changed' , function(done) {
      var email = {
        input_email: newEmail
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: process.env.EXISTING_BASIC_EMAIL,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changeEmail')
        .send(email)
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
      });
    });

    it ('should allow login with new email after email change.', function(done) {
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: newEmail,
        password: process.env.EXISTING_BASIC_PASS})
      .then(function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it ('should change the email back to the original', function(done) {
      var email = {
        input_email: process.env.EXISTING_BASIC_EMAIL
      };
      var agent = chai.request.agent(app);
      agent // Retaining session cookie
      .post('/login')
      .send({
        email: newEmail,
        password: process.env.EXISTING_BASIC_PASS })
      .then(function(res) {
        agent
        .patch('/users/changeEmail')
        .send(email)
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
      });
    });

  });

});
