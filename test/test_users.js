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


describe('/users', function() {
  
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

    it ('should return 401 if no names are specified', function(done) {

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


});
