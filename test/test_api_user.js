process.env.ENVIRONMENT = 'test';
require('dotenv').config();
var express = require('express');
var app = require('../app.js');
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');

describe('api/users', function (done) {
	beforeEach(function (done) {
		done();
	});
	afterEach(function (done) {
		done();
	});
	describe('GET', function () {
		before(function(done) {			
			done();
		});
			it('should return a 400 (bad request) if an unknown query parameters is passed',
				function (done) {
					chai.use(chaiHttp);
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
				function (done) {
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


var passwordComplexity = require('../api/users').isPasswordComplex;

describe('password Complexity check',
	function () {
		beforeEach((done) => {
			express = require('express');
			app = require('../app.js');
			done();
		});
		afterEach((done) => {
			done();
		});
		it('should return false for password less than 8 characters',
			function (done) {
				var isComplex = passwordComplexity('Ab34567');
				isComplex.should.be.false;
				done();
			});
		it('should return false for passwords without numbers',
			function (done) {
				var isComplex = passwordComplexity('Abcdefgh');
				isComplex.should.be.false;
				done();
			});
		it('should return false for passwords without lowercase letters',
			function (done) {
				var isComplex = passwordComplexity('ABCDEFG8');
				isComplex.should.be.false;
				done();
			});
		it('should return false for passwords without uppercase letters',
			function (done) {
				var isComplex = passwordComplexity('abcedfg8');
				isComplex.should.be.false;
				done();
			});
	});
