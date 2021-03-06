var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mysql = require('../dbcon.js');
var session = require('express-session');

router.post('/', function(req, res, next) {
	var pass = req.body.password;
	//console.log(req.body.email, " ", req.body.password);
	mysql.pool.query('CALL selectUserByEmail(?)', [req.body.email], function(err, rows, fields) {
		if (err) {
			console.log(err);
			next(err);
			return;
		}

		var authPass = rows[0];

		if (authPass[0] !== undefined) {
			bcrypt.compare(pass, authPass[0].pwd_hashed, function (err, result) {
				if (result) { // If password matches
					req.session.u_id = authPass[0].u_id;
					req.session.u_type = authPass[0].u_type;
					req.session.email = authPass[0].email;
					req.session.fname = authPass[0].fname;
					req.session.lname = authPass[0].lname;
					req.session.creation_datetime = authPass[0].creation_datetime;
					req.session.save(function(error) {

						mysql.pool.query('UPDATE User SET recovery_code=? WHERE u_id=?', [null, req.session.u_id], function(err, rows, fields) {
							if (err) {
							  console.log(err);
							  next(err);
							  return;
							}
							res.status(200).send('Login success');
						});
					});
					
				} else {
					res.status(401).send('Incorrect password');
				}
			});
		} else {
			res.status(404).send('User not found');
		}
	});


});

module.exports = router;
