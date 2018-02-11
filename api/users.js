var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
const bcrypt = require('bcrypt');
var adminEmail = 'admin@oregonstate.edu';

router.delete('/:u_id',
	function (req, res, next) {
		var message = "deleting user with u_id " + req.params.u_id;
		console.log(message);
		res.send(message);
	});

router.get('/email/available/:email',
	function (req, res, next) {
		pool.query("SELECT false available FROM User where email = ? LIMIT 1", [req.params.email],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					next(err, null);
				} else {
					var available = true;
					if (rows.length > 0)
						available = false;
					res.json({ "available": available });
				}
			});
	});

router.get('/:u_id',
	function (req, res, next) {
		pool.query("CALL selectUserByID(?)", [req.params.u_id],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					next(err, null);
				} else {
					res.send(rows);
				}
			});
	});

router.get('/',
	function(req, res, next) {
		if (req.query.email) {
			pool.query("CALL selectUserByEmail(?)", [req.query.email],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err, null);
					} else {
						res.send(rows);
					}
				});
			}
		else if (req.query.usertype == 'admin') {
			pool.query("CALL selectUserByUserType(?)", ['admin'],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err, null);
					} else {
						res.send(rows);
					}
				});
		}
		else if (req.query.usertype == 'normal' || req.query.usertype == 'basic') {
			pool.query("CALL selectUserByUserType(?)", ['basic'],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						next(err, null);
					} else {
						res.send(JSON.stringify(rows));
					}
				});
		}
		else if (Object.keys(req.query).length == 0) {
			res.status(501).send();
		} else {
			res.status(400).send();
		}
	});

router.put('/:u_id',
	function(req, res, next) {
		var message = "updating user with u_id " + req.param.u_id;
		console.log(message);
		res.send(message);

		pool.query("CALL changeUserNameById(?,?,?)",
			[req.body.fname, req.body.lname, req.body.email, req.body.uid, adminEmail],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					next(err, null);
				} else {
					res.send(JSON.stringify(rows));
				}
			});
	});

router.post('/',
	function(req, res, next) {
		var message = "creating a user";
		console.log(message);
		res.send(message);
	});

module.exports = router;