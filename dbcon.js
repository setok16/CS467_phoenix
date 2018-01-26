var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 10,
	host	: 'oniddb.cws.oregonstate.edu',
	user	: 'zhuzhe-db',
	password: process.env.ZhengDBPass,
	database: 'zhuzhe-db',
	multipleStatements: true
});

module.exports.pool = pool;
