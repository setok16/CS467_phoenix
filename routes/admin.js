var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

/* GET users listing. */
router.get('/', getAllUsers, renderAdminPage);


function getAllUsers(req, res, next) {
	pool.query("SELECT email, fname, lname, creation_datetime from User",
		function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err, null);
			} else {
				req.allUsers = rows;
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

		context.adminData = req.allUsers;
		context.userData = req.allUsers;

		context.countUsers = context.userData.length;
		context.countAdmin = context.adminData.length;

		console.log(context);

		res.render('admin', context);

	} else { // Going back to login page if user is not logged in
		res.redirect('/');
	}
}

module.exports = router;
