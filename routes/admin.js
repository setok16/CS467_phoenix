var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

/* GET users listing. */
router.get('/', function (req, res, next) {
	//res.send('respond with a resource');
	if (req.session.u_type == 'admin') {

		var context = {};
		context.title = 'Admin Page';

		context.data =
			[
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				},
				{
					'email': 'email1@emailserver1.com',
					'fname': 'fName1',
					'lname': 'lName1',
					'creation_datetime': '2018 - 01 - 27T16: 02:36.000Z'
				}
			];

		context.count = 2;

		//pool.query("SELECT email, fname, lname, creation_datetime from User", function (err, rows, fields) {
		//	if (err) {
		//		console.log(err);
		//		next(err);
		//		return;
		//	}
			
		//	context.data = rows;
		//});

		console.log(context.data);

		res.render('admin', context);

	} else { // Going back to login page if user is not logged in
		res.redirect('/');
	}

});

module.exports = router;
