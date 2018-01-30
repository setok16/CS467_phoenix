var express = require('express');
var router = express.Router();
var signaturePad = require('signature_pad');
var mysql = require('../dbcon.js');

/* GET registration page */
router.get('/', function(req, res, next) {

	if (req.session.email) {
		res.redirect('/');
	}

	var context = {};
	context.title = 'Registration';

	// Getting a list of user emails
	mysql.pool.query("SELECT email from User", function(err, rows, fields) {
		if (err) {
			console.log(err);
			next(err);
			return;
		}
		context.emails= JSON.stringify(rows);
		res.render('registration', context);
	});

});

module.exports = router;
