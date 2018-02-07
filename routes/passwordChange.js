var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {

  if (req.session.email) {
    res.redirect('/');
  }

  res.render('passwordChange', {
    title: 'PasswordRecovery',
    hideNav: 'hidden'
  });
});

router.put('/', function(req, res, next) {
  var password = req.body.password;
  var recoveryCode = req.body.recoveryCode;
  //console.log(password, ' ', recoveryCode);
  
  mysql.pool.query('SELECT u_id from User WHERE recovery_code=?', [recoveryCode], function(err, rows, fields) {
    if (err) {
      console.log(err);
      next(err);
      return;
    }

    if (rows[0] !== undefined) { // Valid recoveryCode
      var uID = rows[0].u_id;
      // Password processing
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          mysql.pool.query("UPDATE User SET pwd_hashed=?, recovery_code=? WHERE u_id=?", [hash, null, uID], function(err, rows, fields) {
            res.status(200).send('Success');
          });
        });
      });

    } else { // Invalid recoveryCode
      res.status(403).send('Invalid passcode');
    }
  });
});

module.exports = router;
