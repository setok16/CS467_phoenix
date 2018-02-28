var express = require('express');
var mysql = require('../dbcon.js');
var pool = mysql.pool;
const bcrypt = require('bcrypt');
var router = express.Router();

function adminUser(req, res, next) {
	if (process.env.ENVIRONMENT === 'test') {
		return next();
	}
	if (!req.session || req.session.u_type !== 'admin' || !req.session.u_id) {
		return res.status(403).send();
	}
	pool.query("CALL selectUserByID(?)",
		[req.session.u_id],
		function(err, rows, fields) {
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

router.all('/*', adminUser);

router.delete('/:u_id',
	function(req, res, next) {
		//lookup user by id first.  do not delete if 1) doesn't exist, 2) is special adming or basic user
		pool.query("CALL deleteUserByID(?)",
			[req.params.u_id],
			function(err, result) {
				if (err) {
					console.log('SERVER ERROR: ' + err);
					return;
				}
				res.statusCode = 200;
				res.send();
			});
	});

router.get('/email/available/:email',
	function(req, res, next) {
		pool.query("SELECT false available FROM User where email = ? LIMIT 1",
			[req.params.email],
			function(err, rows, fields) {
				if (err) {
					console.log(err);
				} else {
					let available = true;
					if (rows.length > 0)
						available = false;
					res.json({ "available": available });
				}
			});
	});

router.get('/:u_id',
	function(req, res, next) {
		pool.query("CALL selectUserByID(?)",
			[req.params.u_id],
			function(err, rows, fields) {
				if (err) {
					console.log(err);
				} else {
					res.send(rows);
				}
			});
	});

router.get('/',
	function(req, res, next) {
		if (req.query.email) {
			pool.query("CALL selectUserByEmail(?)",
				[req.query.email],
				function(err, rows, fields) {
					if (err) {
						console.log(err);
						next(err, null);
					} else {
						res.send(rows);
					}
				});
		} else if (req.query.usertype == 'admin') {
			pool.query("CALL selectUserByUserType(?)",
				['admin'],
				function(err, rows, fields) {
					if (err) {
						console.log(err);
						//next(err, null);
					} else {
						res.send(rows[0]);
					}
				});
		} else if (req.query.usertype === 'normal' || req.query.usertype === 'basic') {
			pool.query("CALL selectUserByUserType(?)",
				['normal'],
				function(err, rows, fields) {
					if (err) {
						console.log(err);
						//next(err, null);
					} else {
						res.send(rows[0]);
					}
				});
		} else if (Object.keys(req.query).length === 0) {
			res.status(501).send();
		} else {
			res.status(400).send();
		}
	});

router.put('/:u_id',
	function(req, res, next) {
		var message = "updating user with u_id " + req.param.u_id;
		res.send(message);
		pool.query("CALL changeUserNameById(?,?,?)",
			[req.body.fname, req.body.lname, req.body.uid],
			function(err, rows, fields) {
				if (err) {
					console.log(err);
				} else {
					res.send(JSON.stringify(rows));
				}
			});
	});

router.post('/',
	function(req, res, next) {

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

		var userType = req.body.usertype.toLowerCase();

		if (userType === 'admin') {
			pool.query("CALL addAdminUser(?,?)",
				[req.body.email, passwordHash],
				function(err, rows, fields) {
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
	if (password.length < 8 || !password.match(/[0-9]/i) || !password.match(/[A-Z]/i) || !password.match(/[a-z]/i)) {
		isComplex = false;
	}
	return isComplex;
}

module.exports = { router: router, isPasswordComplex: isPasswordComplex, adminUser: adminUser}
	