var express = require('express');
var mysql = require('../dbcon.js');
var auth = require('../routes/adminAuth');
var pool = mysql.pool;
const bcrypt = require('bcrypt');
var router = express.Router();

router.all('/*', auth.adminUser);

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

router.post('/admin',
	 async function(req, res, next) {
		console.log("saving admin user");
		if (!isPasswordComplex(req.body.password)) {
			return res.status(400).send("The password was not complex enough");
		};
		console.log("saving admin user");
		var passwordHash;
		try {
			passwordHash = await saltPassword(req.body.password);
		} catch (err) {
			return res.status(400).send("Unable to create a user.  Please try again.");
		}

		pool.query("CALL addAdminUser(?,?)",
			[req.body.email, passwordHash],
			function(err, rows, fields) {
				if (err) {
					console.log(err);
					return res.status(400).send("Unable to create a user.  Please try again.");
				} else {
					return res.send(rows);
				}
			});
		//return res.status(403).send();
	});

router.post('/normal',
	async function (req, res, next) {
		console.log("trying to add a user");
		if (!isPasswordComplex(req.body.password)) {
			return res.status(400).send("The password was not complex enough");
		};

		var passwordHash;
		try {
			passwordHash = await saltPassword(req.body.password);
		} catch (err) {
			console.log(err);
			return res.status(400).send("Unable to create a user.  Please try again.");;
		}
		//console.log("PASSWORD HASH: "+ passwordHash);
		pool.query("CALL addNormalUser(?,?,?,?,?)",
			[req.body.email, passwordHash, req.body.fname, req.body.lname, null],
			function(err, rows, fields) {
				if (err) {
					console.log(err);
					return res.status(400).send("Unable to create a user.  Please try again.");
				} else {
					return res.send(rows);
				}
			});

		//return res.status(403).send();
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

//async function saltPassword(password) {
//	const saltRounds = 10;
//	bcrypt.genSalt(saltRounds,
//		function (err, salt) {
//			if (err) {
//				console.log('SERVER ERROR: ' + err);
//			}
//			bcrypt.hash(password,
//				salt,
//				function (err, hash) {
//					if (err) {
//						console.log('SERVER ERROR: ' + err);
//					} else {
//						return hash;
//					}
//				});

//		});
//}


function isPasswordComplex(password) {
	var isComplex = true;
	if (password.length < 8 || !password.match(/[0-9]/i) || !password.match(/[A-Z]/i) || !password.match(/[a-z]/i)) {
		isComplex = false;
	}
	return isComplex;
}

module.exports = { router: router, isPasswordComplex: isPasswordComplex}
	