process.env.ENVIRONMENT = 'test';
require('dotenv').config();
var passwordComplexity = require('../public/scripts/passwordComplexity.js');


describe('public password Complexity check',
	function () {
		xit('should return false for password less than 8 characters',
			async function () {
				var password = 'Ab34567';
				var isComplex;			
				isComplex = await passwordComplexity.checkPasswordComplexity(password, password);
				isComplex.success.should.be.false;
			});
		xit('should return false for passwords without numbers',
			async function () {
				var password = 'Abcdefgh';
				var isComplex = await passwordComplexity.checkPasswordComplexity(password, password);
				isComplex.success.should.be.false;
			});
		xit('should return false for passwords without lowercase letters',
			async function () {
				var password = 'ABCDEFG8';
				var isComplex = await passwordComplexity.checkPasswordComplexity(password, password);
				isComplex.success.should.be.false;
			});
		xit('should return false for passwords without uppercase letters',
			async function () {
				var password = 'abcedfg8';
				var isComplex = await passwordComplexity.checkPasswordComplexity(password, password);
				isComplex.success.should.be.false;
			});
	});