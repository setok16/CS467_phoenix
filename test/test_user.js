require('dotenv').config();
var app = require('../app.js');
var users = require('../api/users.js');
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');

chai.use(chaiHttp);

describe('api/users', function () {
	describe('GET',
		function() {
			it('should return a 400 (bad request) if an unknown query parameters is passed',
				function(done) {
					chai.request(app)
						.get('/api/users')
						.query({ uknown: 'value' })
						.send()
						.end(function(err, res) {
							res.should.have.status(400);
							done();
						});
				});
			it('should return a 501 (not implemented) if no query parameters are passed',
				function(done) {
					chai.request(app)
						.get('/api/users')
						.send()
						.end(function(err, res) {
							res.should.have.status(501);
							done();
						});
				});
			it('should return 1 user when getting the admin user by email address',
				function(done) {
					chai.request(app)
						.get('/api/users?email=admin@oregonstate.edu')
						.send()
						.end(function (err, res) {
							res.should.have.status(200);
							res.body.should.be.a('array');
							res.body[0][0].should.be.a('object');
							res.body[0].should.have.length(1);
							res.body[0][0].should.have.property('u_type').eql('admin');
							done();
						});
				});
			it('should return false if an email already exists in the database',
				function (done) {
					chai.request(app)
						.get('/api/users/email/available/admin@oregonstate.edu')
						.send()
						.end(function (err, res) {
							res.should.have.status(200);
							res.body.should.have.property('available').eql(false);
							done();
						});
				});
		});
	});

