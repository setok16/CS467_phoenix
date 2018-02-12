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
						connection.query('SELECT 1;',
							function (err, rows, fields) {
								should.not.exist(err);
								should.exist(rows);
								rows.should.deep.equal([{ 1: 1 }]);
								fields[0].name.should.equal('1');
							});
						done();
					});
				});

			//it("Should have a table named User",
			//	function (done) {
			//		mysql.pool.query('SELECT * FROM information_schema.tables WHERE table_name = "User"', function (err, rows, fields) {
			//			if (err) {
			//				done(err);
			//				return;
			//			}
			//			rows.length.should.deep.equal(1);
			//			rows[0].TABLE_NAME.should.equal('User');
			//			should.not.exist(err);
			//			done();
			//		});
			//	});

			//it("Should have a table named Award",
			//	function (done) {
			//		mysql.pool.query('SELECT * FROM information_schema.tables WHERE table_name = "Award"', function (err, rows, fields) {
			//			if (err) {
			//				done(err);
			//				return;
			//			}

			//			var one = 1;
			//			one.should.equal(3);
			//			rows.length.should.deep.equal(1);
			//			rows[0].TABLE_NAME.should.equal('Award');
			//			should.not.exist(err);
			//			done();
			//		});
			//	});
		});
});
