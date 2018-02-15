var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
const bcrypt = require('bcrypt');
var adminEmail = 'admin@oregonstate.edu';

router.delete('/:u_id',
	function (req, res, next) {	
		pool.query("CALL deleteUserByID(?)",
			[req.params.u_id],
			function (err, result) {
				if (err) {
					console.log('SERVER ERROR: ' + err);
					//next(err);
					return;
				}
				res.statusCode = 200;
				res.send();
			});
	});

router.get('/email/available/:email',
	function (req, res, next) {
		pool.query("SELECT false available FROM User where email = ? LIMIT 1", [req.params.email],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					//next(err, null);
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
					//next(err, null);
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
						//next(err, null);
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
						//next(err, null);
					} else {
						res.send(JSON.stringify(rows));
					}
				});
		}
		else if (Object.keys(req.query).length === 0) {
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
			[req.body.fname, req.body.lname, req.body.uid],
			function (err, rows, fields) {
				if (err) {
					console.log(err);
					//next(err, null);
				} else {
					res.send(JSON.stringify(rows));
				}
			});
	});

router.post('/',
	function (req, res, next) {

		//console.log("BODY:" + req.body.password + req.body.usertype + req.body.email);
		if (!isPasswordComplex(req.body.password)) {
			res.status(400).send();
			return;
		};

		var passwordHash;
		try {
			passwordHash = saltPassword(req.body.password);
		} catch (err) {
			res.send("PASSWORDHASH ERROR: " + err);
			return;
		}

		//console.log("passwordHash:" + passwordHash);
		
		var userType = req.body.usertype.toLowerCase();
		//console.log("usertype:" + userType);

		if (userType === 'admin') {
			pool.query("CALL addAdminUser(?,?)",
				//[req.body.fname, req.body.lname,]
				[req.body.email, passwordHash],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						res.error(error).send();
						//next(err, null);
						return;
					} else {
						res.send(rows);
						return;
					}
				});

		} else if (userType === 'normal' || userType === 'basic') {
			console.log("create basic user");
			res.send(req.body);
			res.send("creating usertype whenenver you implement this");
			return;
		};

		res.status(403).send();
	});

async function saltPassword(password) {
	try {
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (e) {
		console.log("bcrypt errors: " + e);
	}
}

function isPasswordComplex(password) {
	var isComplex = true;
	if (password.length < 8
		|| !password.match(/[0-9]/i)
		|| !password.match(/[A-Z]/i)
		|| !password.match(/[a-z]/i)) {
		isComplex = false;
	}
	return isComplex;
}

module.exports = router;