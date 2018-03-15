process.env.ENVIRONMENT = 'test';
require('dotenv').config();
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');
var getEmailParts = require('../api/reports').getEmailParts;

describe('parsing for domain', (done) => {
	it('should return domain on valid email address format',
		(done) => {
			var domain = 'test';
			var email = 'myemail@' + domain + '.com';
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal(domain);
			done();
		});
	it('should return domain on valid email address format with subdomain',
		(done) => {
			var domain = 'test.test';
			var email = 'myemail@' + domain + '.com';
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal(domain);
			done();
		});
	it('should return unkown on partial email address format',
		(done) => {
			var domain = 'test';
			var email = 'myemail@' + domain;
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal('unknown');
			done();
		});
	it('should return unkown on string with no address',
		(done) => {
			var email = 'myemail';
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal('unknown');
			done();
		});
	it('should return unknown on empty email address',
		(done) => {
			var email = '';
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal('unknown');
			done();
		});
	it('should return unknown on invalid address',
		(done) => {
			var email = '@@@@';
			var parsedDomain = getEmailParts(email).domain;
			parsedDomain.should.be.equal('unknown');
			done();
		});
});

describe('api/awards', function(done) {
	beforeEach(() => {
	});
	afterEach(() => {
	});
	describe('GET',
		() => {
			it('should return an award',
				(done) => {
					chai.use(chaiHttp);
					chai.request(require('../app.js'))
						.get('/api/awards')
						.query({fname:'you'})
						.send()
						.end((err, res) => {
							res.should.have.status(200);
							res.body.length.should.be.above(0);
						});
					
					done();
				});

		});

});



