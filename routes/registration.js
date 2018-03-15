var express = require('express');
var router = express.Router();
var signaturePad = require('signature_pad');
var mysql = require('../dbcon.js');
var base64Img = require('base64-img');
var bcrypt = require('bcrypt');
var passwordIsValid = require('../utils-module/utils.js').passwordIsValid;
var emailIsAvailable = require('../utils-module/utils.js').emailIsAvailable;

/* GET registration page */
router.get('/', function(req, res, next) {

	if (req.session.email) {
		res.redirect('/');
	}

	var context = {};
	context.title = 'Registration';
  context.hideNav = 'hidden';
  context.customScript = '<script src="public/scripts/emailAvailability.js"></script>';
  context.customScript += '<script src="public/scripts/passwordComplexity.js"></script>';

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

/* POST registration page */
router.post('/', function(req, res, next) {

	// Image processing (no longer used)
	/*
	var imgPath = 'public/signatures/';
	var imgName = req.body.email+'_signature';
	var imgFullPath = '/' + imgPath + imgName + '.png';
	base64Img.imgSync(req.body.base64, imgPath, imgName);
	*/
  let checkEmailPromise = emailIsAvailable(req.body.email);
  checkEmailPromise.then((available) => {
    if (available) {
      if (req.body.fname == '' || req.body.lname == '' || req.body.email == '' || req.body.password == '') {
        res.status(409).send('Invalid input');
        return;
      } else if (!passwordIsValid(req.body.password, req.body.rptPassword)) {
        res.status(408).send('Invalid passwords');
        return;
      } 

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
          mysql.pool.query("INSERT INTO User (`fname`, `lname`, `email`, `pwd_hashed`, `signature`) VALUES (?,?,?,?,?)",
          [req.body.fname, req.body.lname, req.body.email, hash, req.body.base64],
          function(err, result) {
            if (err) {
              console.log('SERVER ERROR: ' + err);
              next(err);
              return;
              //result.send('SERVER ERROR: ' + err);
            }
          });
          console.log('Sign up for \"' +  req.body.fname + ' ' + req.body.lname + '\"was successfull.'); 
          res.send('Sign up for \"' +  req.body.email + '\" was successfull.');
          //res.send('Sign up for \"' +  req.body.fname + " " + req.body.lname + '\" was successfull. Signature saved in: ' + imgFullPath); // REMOVE THIS AFTER DB CONNECTION
        });
      });
    } else {
      res.status(407).send('Invalid email');
    }
  });
});

module.exports = router;
