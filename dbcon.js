var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 10,
	// Database access credentials:
	// Available as Environment Variables
	// for use in AWS Elastic Beanstalk
	host	: process.env.RDS_HOSTNAME,
	port	: process.env.RDS_PORT,
	user	: process.env.RDS_USERNAME,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DB_NAME,
	multipleStatements: true
});

module.exports.pool = pool;