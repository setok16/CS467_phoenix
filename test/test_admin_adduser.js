require('dotenv').config();
var admin = require('../routes/admin.js');
var should = require('chai').should();
let chaiHttp = require('chai-http');

describe('admin',
	function () {
		//before(function() {
		//	//Before each test we will mock the database here
		//	console.log("mock database here");
		//});
		describe('getAdminUsers', function() {
			it('should set adminUsers on request',
				function() {
					
				});
		});

	});