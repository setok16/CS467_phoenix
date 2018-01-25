var express = require('express');
var router = express.Router();
var base64Img = require('base64-img');
var bcrypt = require('bcrypt');
//var mysql = require('./dbcon.js');

/* POST registration page */
router.post('/', function(req, res, next) {

	// Image processing
	var base64 = req.body.base64.substr(22); // Omitting prefix
	var imgPath = 'public/signatures/';
	var imgName = req.body.email+'_sigature';
	var imgFullPath = '/' + imgPath + imgName + '.png';
	base64Img.imgSync(req.body.base64, imgPath, imgName);

	// Password processing (async)
	const saltRounds = 10;
	const plainTextPass = req.body.password;
	var hash = bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(plainTextPass, salt, function(err, hash) {
			console.log("email: " + req.body.email + " pass: " + hash + " imgPath: " + imgFullPath);
			/* THIS IS FOR THE DB IS READY
			mysql.pool.query("INSERT INTO users (`email`, `hash`, `imgPath`) VALUES (?,?,?",
			[req.body.email, hash, imgFullPath],
			function(err, res) {
				if (err) {
					res.send('SERVER ERROR');
				}
				res.send('Sign up for \"' +  req.body.email + '\" is successfull. Signature saved in: ' + imgFullPath);
			});
			*/
			res.send('Sign up for \"' +  req.body.email + '\" is successfull. Signature saved in: ' + imgFullPath); // REMOVE THIS AFTER DB CONNECTION
		});
	});
});

module.exports = router;
