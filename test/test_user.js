require('dotenv').config();
var app = require('../app.js');
var users = require('../api/users.js');
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
app.use(require('body-parser').json());
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
	describe('POST',
		function() {
			it('should return status 400 (bad request) if password is not complex enough',
				function(done) {
					chai.request(app)
						.post('/api/users/')
						.set('content-type', 'application/json')
						.send(JSON.stringify({
							"email": "any@eamil",
							"password": "password",
							"usertype": "admin"
						}))
						//.field('email', 'any@any')
						//.field('password', 'password')
						//.field('usertype', 'admin')
						//.send()
						.end(function (err, res) {
							//console.log(err);
							//console.log(res);
							res.should.have.status(400);
							done();
						});
				});
			it('should return status 200 (ok) with a valid password',
				function (done) {
					chai.request(app)
						.post('/api/users/')
						.set('content-type', 'application/json')
						.send(JSON.stringify({
							"email": "any@eamil",
							"password": "Password2",
							"usertype": "basic"
						}))
						//.send({email: "any@eamil",password: "Password1",usertype: "basic"})
						//.field('email', 'any@any')
						//.field('password', 'Password1')
						//.field('usertype', 'admin')
						.end(function (err, res) {
							//console.log(err);
							res.should.have.status(200);
							done();
						});
				});
		}
	);
});


//describe('password Complexity check',
//	function() {
//		it('should return false for password less than 8 characters',
//			function(done) {
//				var isComplex = users.isPasswordComplex('12345678');
//				isComplex.should.be.false;
//			});
//	});

