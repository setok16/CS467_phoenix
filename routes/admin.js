var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
const bcrypt = require('bcrypt');

function checkUserType(req, res, next) {
	req.body.usertype = req.body.usertype.toLowerCase();
	if (req.body.usertype === 'admin' || req.body.usertype === 'normal') {
		return next();
	} else {
		console.log("The user type was not sent");
		redirectToAdmin(req, res, next);
	}
}

function saltPassword(req, res, next) {
	const saltRounds = 10;
	bcrypt.genSalt(saltRounds,
		function(err, salt) {
			if (err) {
				console.log('SERVER ERROR: ' + err);
				next(err);
			}
			console.log(req.body);
			console.log("SALT:::::::::::::: " +salt);
			bcrypt.hash(req.body.password,
				salt,
				function(err, hash) {
					if (err) {
						console.log('SERVER ERROR: ' + err);
						next(err);
					} else {
						req.body.pwd_hash = hash;
						next();
					}
				});

		});
}

function createUser(req, res, next) {
	pool.query("INSERT INTO User (`u_type`, `fname`, `lname`, `email`, `pwd_hashed`) VALUES (?,?,?,?,?)",
			[ req.body.usertype, req.body.fname, req.body.lname, req.body.email, req.body.pwd_hash],
		function (err, result) {
			if (err) {
				console.log('SERVER ERROR: ' + err);
				next(err);
				return;
			} else {
				console.log("user should be created here" + result);
				console.log(req.body);
				next();
			}
		});
};

function redirectToAdmin(req, res, next) {
	res.redirect('/admin');
}

router.post('/create/user', checkUserType, saltPassword ,createUser, redirectToAdmin);

/* GET users listing. */
router.get('/', getNormalUsers, getAdminUsers, renderAdminPage);

function getNormalUsers(req, res, next) {
	pool.query("SELECT u_id, email, fname, lname, creation_datetime, signature from User where u_type like 'normal'",
		function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err, null);
			} else {
				req.normalUsers = rows;
				next();
			}
		});
};

//function addSignatureImagePath(req, res, next) {

//	for (var i = 0, len = req.normalUsers.length; i < len; i++) {
//		//someFn(arr[i]);
//		var imgPath = 'public/signatures/';
//		var imgName = req.normalUsers[i].email + '_signature';
//		var imgFullPath = '/' + imgPath + imgName + '.png';
//		base64Img.imgSync(req.body.base64, imgPath, imgName);

//	}

//	//req.normalUsers.forEach( function(item)
//	//{
//	//	var imgPath = 'public/signatures/';
//	//	var imgName = req.body.email + '_signature';
//	//	var imgFullPath = '/' + imgPath + imgName + '.png';
//	//	base64Img.imgSync(req.body.base64, imgPath, imgName);
//	//});		
//};

function getAdminUsers(req, res, next) {
	pool.query("SELECT u_id, email, fname, lname, creation_datetime from User where u_type like 'admin'",
		function (err, rows, fields) {
			if (err) {
				console.log(err);
				next(err, null);
			} else {
				req.adminUsers = rows;
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

		context.userData = req.normalUsers;
		context.adminData = req.adminUsers;
		
		context.countUsers = context.userData.length;
		context.countAdmin = context.adminData.length;
		
		res.render('admin', context);

	} else { // Going back to login page if user is not logged in
		res.redirect('/');
	}
}

module.exports = router;
