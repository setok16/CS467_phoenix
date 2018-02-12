require('dotenv').config();
var mysql = require('../dbcon.js');
var should = require('chai').should();

describe("Database", function () {
	describe("Connection",
		function() {
			it("Should not error",
				function(done) {
					mysql.pool.getConnection(function(err, connection) {
						if (err) {
							done(err);
							return;
						}
						mysql.pool.query('SELECT 1;',
							function (err, rows, fields) {
								should.not.exist(err);
								rows.should.deep.equal([{ 1: 1 }]);
								fields[0].name.should.equal('1');
							});
						done();
					});
				});

			it("Should have a table named user",
				function (done) {
					mysql.pool.query('SELECT * FROM information_schema.tables WHERE table_name = "user"', function (err, rows, fields) {
						if (err) {
							done(err);
							return;
						}
						rows.length.should.equal(1);
						rows[0].TABLE_NAME.should.equal('user');
						should.not.exist(err);
						done();
					});
				});
		});
});
