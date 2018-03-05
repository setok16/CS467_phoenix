//var express = require('express');
var mysql = require('../dbcon.js');
var pool = mysql.pool;

function adminUser(req, res, next) {
	if (process.env.ENVIRONMENT === 'test') {
		return next();
	}
	if (!req.session || req.session.u_type !== 'admin' || !req.session.u_id) {
		return res.status(403).send();
	}
	pool.query("CALL selectUserByID(?)",
		[req.session.u_id],
		function (err, rows, fields) {
			if (err) {
				console.log('DB ERROR: ' + err);
				res.status(403).send();
			} else if (rows[0].length < 1) {
				console.log("no users found for u_id");
				res.status(403).send();
				return;
			} else if (rows[0][0].u_type.toLowerCase() !== 'admin') {
				console.log("u_type is not admin");
				res.status(403).send();
			} else {
				next();
			}
		});
}

module.exports.adminUser = adminUser;