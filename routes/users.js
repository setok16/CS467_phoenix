var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
//var moment = require('moment');
var moment_tz = require('moment-timezone');

var signature_local = null;

var validateNormalUser = function (req, res, next) {
	console.log("Exectuing validateNormalUser");
	
	if (req.session.u_type == 'normal') { // If user has session and session variable shows a normal user
		
		/*
		if (req.session.justLoggedIn) {	// User is just logged in, skip checking db
			console.log("skip checking db");
			req.session.justLoggedIn = false;
			req.session.save(function(err) {
				next();
			});
		}
		else
		*/
		{	// Compare user data with those in db
			console.log("checking User db");
			pool.query("CALL selectUserByID(?)", [req.session.u_id], function(err, result, fields) {
			
				//console.log(typeof result); // Object
				//console.log(result); // result[0] is the array of rows
				//console.log(JSON.stringify( result[0][0]) );
				//console.log(result[0][0]['u_id'] + result[0][0]['lname']);
				//console.log(result[0].length);
	
				if (err) {	// Database connection error
					console.log(err);
					res.render('users_error', {
						title: 'User Account - Error',
						error_message: 'User table connection failed.',
						redirect_message: 'Logging out in 5 seconds.',
						redirect_location: '/logout',
						timeout_ms: 5000
					});
					
				}
				else if (result[0].length != 1) {	// No user with u_id = req.session.u_id in db
					res.render('users_error', {
						title: 'User Account - Error',
						error_message: 'User does not exist.',
						redirect_message: 'Logging out in 5 seconds.',
						redirect_location: '/logout',
						timeout_ms: 5000
					});
					
				}
				else if (result[0][0]['creation_datetime'] != req.session.creation_datetime) {
					// creation timestamp doesn't match
					res.render('users_error', {
						title: 'User Account - Error',
						error_message: 'User creation timestamp does not match.',
						redirect_message: 'Logging out in 5 seconds.',
						redirect_location: '/logout',
						timeout_ms: 5000
					});
				}
				else {	// User exists. Compare session variables with db data
					if (result[0][0]['email'] != req.session.email) {
						req.session.email = result[0][0]['email'];
					}
					if (result[0][0]['fname'] != req.session.fname) {
						req.session.fname = result[0][0]['fname'];
					}
					if (result[0][0]['lname'] != req.session.lname) {
						req.session.lname = result[0][0]['lname'];
					}
					signature_local = result[0][0]['signature'];
					req.session.justLoggedIn = false;
					req.session.save(function(err) {
						next();
					});
				}
				
			});
		}
		
	} else if (req.session.u_type == 'admin') {
		res.redirect('/admin'); // If user has session but is an admin user, direct to /admin
	} else {
		res.redirect('/'); // If there is no session, go back to login page
	}
};

router.get('*', validateNormalUser, function(req, res) {

	// Format the creation timestamp
	//console.log(req.session.creation_datetime);
	var creation_datetime_formatted = moment_tz(req.session.creation_datetime).format('llll');
	//console.log(creation_datetime_formatted);

	// Calculate the number of days since registration
	var now_in_pacific = moment_tz.tz(new Date(), 'US/Pacific');
	var creation_datetime_tz = moment_tz.tz(req.session.creation_datetime, 'US/Pacific');
	var days = now_in_pacific.diff(creation_datetime_tz, 'days');
	//console.log(days);

	// Store the signature to be inserted to the .hbs html file
	var signature_inserted_to_html = '';

	if (signature_local) {	// signature is not Null
		signature_inserted_to_html = '<img class="img-fluid" src="' + signature_local + '"/>';
	} else {	// signature is Null
		signature_inserted_to_html = 'No signature on file.';
	}

	// Import user-created awards
	var user_num_of_awards = 0;

	console.log("checking Award db");
	pool.query("CALL selectAwardByUserID(?)", [req.session.u_id], function(err, award_result, fields) {

		if (err) {	// Database connection error
			console.log(err);
			res.render('users_error', {
				title: 'User Account - Error',
				error_message: 'Award table connection failed.',
				redirect_message: 'Logging out in 5 seconds.',
				redirect_location: '/logout',
				timeout_ms: 5000
			});
		}
		else {
			user_num_of_awards = award_result[0].length;
		}

	});
	

	var context = {};
	context = {
		title: 'User Account',
		session: {
			email: req.session.email,
			fname: req.session.fname,
			lname: req.session.lname,
			timestamp: creation_datetime_formatted,
			signature: signature_inserted_to_html,
			elapsed_days: days,
			num_of_awards: user_num_of_awards
		},
		showProfileTab: 1
	};

	if (req.query.tab == 'awards') { // could use /users?tab=awards in the URL to first display the awards tab
		context.showProfileTab = 0;
	}

	console.log("Exectuing user page rendering");
	res.render('users.hbs', context);
});


module.exports = router;