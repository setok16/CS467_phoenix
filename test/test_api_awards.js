process.env.ENVIRONMENT = 'test';
require('dotenv').config();
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');

describe('api/awards', function(done) {
	describe('GET',
		() => {
			it('should return an award when first name in query prameter',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({fname:'you'})
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.be.above(0);
							done();
						});
				});
			it('should return an award when last name in query prameter',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({ lname: 'deserve' })
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.be.above(0);
							done();
						});
				});
			it('should return an award when email in query prameter',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({ email: 'it@yahoo.com' })
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.be.above(0);
							done();
						});
				});
			it('should return an award when all values in query prameter',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({ email: 'it@yahoo.com', lname: 'deserve', fname: 'you'})
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.be.above(0);
							done();
						});
				});

			it('should not return an award when name with no award is passed int',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({ email: 'it@yahoo.com', lname: 'deserve', fname: 'you do not' })
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.equal(0);
							done();
						});
				});

			it('should not return an award when query parameters are passed',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({ email: 'it@yahoo.com', lname: 'deserve', fname: 'you do not' })
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.equal(0);
							done();
						});
				});
		});

});



