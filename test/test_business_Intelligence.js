require('dotenv').config();
var sinon = require('sinon');
var express = require('express');
//var app = require('../app.js');
var should = require('chai').should();
var chai = require('chai');
var chaiHttp = require('chai-http');
//var sinon = require('sinon');

var dbstub;

describe('api/awards', function(done) {
	beforeEach(() => {

		var rows =
		[
			{
				fname: 'you',
				lname: 'deserve',
				email: 'it@yahoo.com',
				award_type: 'month',
				issuer_email: 'Users@oregonstate.edu',
				granted_date: '2018-01-17 08:00:00'
			}
		];

		dbstub = sinon.stub(require('../dbcon.js').pool,"query");
		dbstub.returns(rows);

	});
	afterEach(() => {
		// dbstub.restore();
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
							console.log(res.body);
						});
					
					done();
				});

		});

});