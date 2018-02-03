var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

/* GET users listing. */
router.get('/', getNormalUsers, getAdminUsers, renderAdminPage);

function getNormalUsers(req, res, next) {
	pool.query("SELECT u_id, email, fname, lname, creation_datetime, signature from User where u_type like 'normal'",
		function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err, null);
			} else {
				req.getNormalUsers = rows;
				next();
			}
		});
};

function getAdminUsers(req, res, next) {
	pool.query("SELECT u_id, email, fname, lname, creation_datetime from User where u_type like 'admin'",
		function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err, null);
			} else {
				req.getAdminUsers = rows;
				next();
			}
		});
};

function renderAdminPage (req, res) {
	//res.send('respond with a resource');
	if (req.session.u_type == 'admin') {

		var context = {};
		context.title = 'Admin Account';
		context.session = { email: req.session.email };

		context.userData = req.getNormalUsers;
		context.adminData = req.getAdminUsers;
		
		context.countUsers = context.userData.length;
		context.countAdmin = context.adminData.length;

		console.log(context);

		res.render('admin', context);

	} else { // Going back to login page if user is not logged in
		res.redirect('/');
	}
}

module.exports = router;
