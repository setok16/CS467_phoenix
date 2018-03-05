var express = require('express');
var mysql = require('../dbcon.js');
var auth = require('../routes/adminAuth');
var pool = mysql.pool;
var router = express.Router();


router.all('/*', auth.adminUser);

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


router.get('/',
	function (req, res, next) {
		var searchList = [];

		if (req.query.fname) {
			searchList.push({ search: 'receiver_fname', value: req.query.fname});
		}
		if (req.query.lname) {
			searchList.push({ search: 'receiver_lname', value: req.query.lname });
		}
		if (req.query.email) {
			searchList.push({ search: 'receiver_email', value: req.query.email });
		}

		if (searchList.length < 1) {
			res.statusCode = 202;
			res.send(req.query);
			return;
		};

		var sql = "SELECT a.receiver_fname as fname, a.receiver_lname as lname, a.receiver_email as email, a.c_type as award_type, u.email as issuer_email, a.granted_datetime as granted_date FROM Award a";
		sql += " LEFT JOIN User u ON u.u_id = a.user_id";
		sql += " WHERE 1=1";

		var searchValues = [];
		
		searchList.forEach(function(element) {
			sql += " and a." + element.search + " like ?";
			searchValues.push(element.value);
		});

		
		sql += ";";

		//res.send(searchList, sql, searchValues);
		
		pool.query(sql,
			searchValues,
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