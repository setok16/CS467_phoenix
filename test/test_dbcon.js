var assert = require('assert');
var mysql = require('../dbcon_local.js');

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
							function(err, rows, fields) {
								assert.ifError(err);
								assert.deepEqual(rows, [{ 1: 1 }]);
								assert.equal(fields[0].name, "1");
							});
						done();
					});
				});

			it("Should find user table",
				function(done) {
					mysql.pool.getConnection(function(err, connection) {
							if (err) {
								done(err);
								return;
							}
							//todo: should this user connection instead of mysql?
							connection.query('SELECT * FROM information_schema.tables WHERE table_name = ?;',
								"user",
								function(err, rows, fields) {
									console.log(rows);
									assert.ifError(err);
									assert.equal(rows.length, 1);
									assert.equal(rows[0].TABLE_NAME, 'user');
								});
							connection.release();
							done();
						}
					);
				});
		});
});
