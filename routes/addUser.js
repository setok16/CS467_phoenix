var express = require('express');
var router = express.Router();
var base64Img = require('base64-img');
var bcrypt = require('bcrypt');
//var mysql = require('./dbcon.js');

/* POST registration page */
router.post('/', function(req, res, next) {

	// Image processing
	var imgPath = 'public/signatures/';
	var imgName = req.body.email+'_sigature';
	var imgFullPath = '/' + imgPath + imgName + '.png';
	base64Img.imgSync(req.body.base64, imgPath, imgName);

	// Defining user type
	var type = 'user';

	// Password processing (async)
	const saltRounds = 10;
	const plainTextPass = req.body.password;
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if (err) {
			console.log("ERROR GENERATING SALT: " + err);
			res.send("ERROR GENERATING SALT: " + err);
		}
		bcrypt.hash(plainTextPass, salt, function(err, hash) {
			if (err) {
				console.log("ERROR HASHING: " + err);
				res.send("ERROR HASHING: " + err);
			}
			console.log('Sign up for \"' +  req.body.fname + " " + req.body.lname + '\" was successfull. Signature saved in: ' + imgFullPath); 
			/* THIS IS FOR WHEN THE DB IS READY
			mysql.pool.query("INSERT INTO users (`fname`, `lname`, `email`, `hash`, `imgPath`, `type`) VALUES (?,?,?,?,?,?",
			[req.body.fname, req.body.lname, req.body.email, hash, imgFullPath, type],
			function(err, res) {
				if (err) {
					console.log('SERVER ERROR: ' + err);
					res.send('SERVER ERROR: ' + err);
				}
				res.send('Sign up for \"' +  req.body.email + '\" was successfull. Signature saved in: ' + imgFullPath);
			});
			*/
			res.send('Sign up for \"' +  req.body.fname + " " + req.body.lname + '\" was successfull. Signature saved in: ' + imgFullPath); // REMOVE THIS AFTER DB CONNECTION
		});
	});
});

module.exports = router;
