var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

router.post('/',
	function (req, res, next) {
		pool.query("CALL addAward(?,?,?,?,?,?)",
			[req.body.c_type,
				req.body.user_id,
				req.body.receiver_fname,
				req.body.receiver_lname,
				req.body.receiver_email,
				req.body.granted_datetime],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					res.json(err);
				} else {
					res.json(rows);
				}
			});
	});

module.exports = router;