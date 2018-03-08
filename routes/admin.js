var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
const bcrypt = require('bcrypt');
var adminEmail = 'admin@oregonstate.edu';

function updateUser(req, res, next) {
	pool.query("UPDATE User SET `fname` = ?, `lname` =  ?, `email` = ? WHERE  `u_id` = ? AND `email` <> ?",
		[req.body.fname, req.body.lname, req.body.email, req.body.uid, adminEmail],
		function (err, result) {
			if (err) {
				console.log('SERVER ERROR: ' + err);
				next(err);
			} else {
				next();
			}
		});
}

router.put('/update', updateUser, renderAdminPage);

//function validateSession(req, res, next) {

//	return next();
//}


//function redirectToAdmin(req, res, next) {
//	res.redirect('/admin');
//}


//function checkUserType(req, res, next) {
//	console.log(req.body);
//	if (req.body.usertype) {
//		req.body.usertype = req.body.usertype.toLowerCase();
//		if (req.body.usertype === 'basic') {
//			req.body.usertype = 'normal';
//		}
//		if (req.body.usertype === 'admin' || req.body.usertype === 'normal') {
//			return next();
//		}
//	} else {
//		console.log("The user type was not sent");
//		redirectToAdmin(req, res, next);
//	}
//}

//function validateCreateRequest(req, res, next) {
//	if (req.body.password.length < 8) {
//		res.invalidreq.passwordTooShort = true;
//	}
//	if (!req.body.password.match(/[0-9]/i)) {
//		res.invalidreq.passwordNoNumber = true;
//	}
//	if (!req.body.password.match(/[A-Z]/i)) {
//		res.invalidreq.passwordNoUpperCase = true;
//	}
//	if (!req.body.password.match(/[a-z]/i)) {
//		res.invalidreq.passwordNoLowerCase = true;
//	}
//	if (res.invalidreq) {
//		res.statusCode(400);
//	}
//	console.log("validate request here");
//	next();
//}

//function saltPassword(req, res, next) {
//	const saltRounds = 10;
//	bcrypt.genSalt(saltRounds,
//		function(err, salt) {
//			if (err) {
//				console.log('SERVER ERROR: ' + err);
//				next(err);
//			}
//			bcrypt.hash(req.body.password,
//				salt,
//				function(err, hash) {
//					if (err) {
//						console.log('SERVER ERROR: ' + err);
//						next(err);
//					} else {
//						req.body.pwd_hash = hash;
//						next();
//					}
//				});

//		});
//}

//function createUser(req, res, next) {
//	pool.query("INSERT INTO User (`u_type`, `fname`, `lname`, `email`, `pwd_hashed`) VALUES (?,?,?,?,?)",
//			[ req.body.usertype, req.body.fname, req.body.lname, req.body.email, req.body.pwd_hash],
//		function (err, result) {
//			if (err) {
//				console.log('SERVER ERROR: ' + err);
//				next(err);
//				return;
//			} else {
//				next();
//			}
//		});
//};

//router.post('/create/user', validateSession, checkUserType, validateCreateRequest, saltPassword ,createUser, redirectToAdmin);

router.get('/',renderAdminPage);

async function renderAdminPage (req, res) {
	//res.send('respond with a resource');
		if (req.session.u_type === 'admin') {

			var context = {};

			context.customHeader =
				'<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs/dt-1.10.16/datatables.min.css"/>';

			context.customScript =
				'<script type="text/javascript" src="https://cdn.datatables.net/v/bs/dt-1.10.16/datatables.min.js"></script>';
			context.customScript += '<script src="public/scripts/emailAvailability.js"></script>';
			context.customScript += '<script src="public/scripts/passwordComplexity.js"></script>';
			context.customScript += '<script src="public/scripts/adminFunctions.js"></script>';
			context.customScript += '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>';
			context.customScript += '<script> $(document).ready(function () { $("#normalTable").DataTable({ ' +
				'"lengthMenu": [ 5, 10, 25, 50, 75, 100 ], ' +
				'"pageLength": 5});}); ' +
				'</script >';
			context.customScript += '<script> $(document).ready(function () { $("#adminTable").DataTable({ ' +
				'"lengthMenu": [ 5, 10, 25, 50, 75, 100 ], ' +
				'"pageLength": 5, ' +
				'"bAutoWidth": false, \"' +
				'aoColumns" : [ ' +
				'{ sWidth: \'5%\' },' +
				'{ sWidth: \'35%\' },' +
				'{ sWidth: \'35%\' },' +
				'{ sWidth: \'25%\' }]});}); ' +
				'</script >';
			context.customScript += "<script> $(document).ready(function () { $('#normalTable').DataTable(); }); </script >";
			//context.customScript += "<script> $(document).ready(function ()" +
			//	" { $('table.display').DataTable(); });" +
			//	""
			//	" </script >";
			
			context.title = 'Admin Account';
			context.session = { email: req.session.email };

			if (req.query) {
				if (req.query.tab === 'admin') {
					context.showAdminTab = 'show active';
				} else if (req.query.tab === 'report') {
					context.showReportTab = 'show active';
				} else {
					context.showNormalTab = 'show active';
				}
			} else {
				context.showNormalTab = 'show active';
			}

			pool.query("CALL selectUserByUserType(?)",
				['normal'],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						context.userData = [];
						context.countUsers = 0;
					} else
					{
						context.userData = rows[0];
						context.countUsers = rows.length;
					}
					pool.query("CALL selectUserByUserType(?)", ['admin'],
						function (err, rows, fields) {
							if (err) {
								console.log(err);
								context.adminData = rows[0];
								context.countAdmin = 0;
							} else {
								context.adminData = rows[0];
								context.countAdmin = rows[0].length;
							}
							return res.render('admin', context);
						});
				});
			
		} else { // Going back to login page if user is not logged in
			res.redirect('http://' + req.headers.host + '/');
		}
	
}

module.exports = router;
