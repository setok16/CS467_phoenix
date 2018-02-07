var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var nodemailer = require('nodemailer');
var dotenv = require('dotenv').config();
var randomstring = require('randomstring');

/* GET password recovery page */
router.get('/', function(req, res, next) {
  if (req.session.email) { // Proper redirection
    res.redirect('/');
  }

  res.render('passwordRecovery', {
    title: 'Password Recovery',
    hideNav: 'hidden'
  });
});

/* PUT password recovery */
router.put('/', function(req, res, next) {
  var email = req.body.email;
  mysql.pool.query('SELECT u_id from User WHERE email=?', [email], function(err, rows, fields) {
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    if (rows[0] !== undefined) { // User found

      var recoveryCode = randomstring.generate();
      var fullURL = req.protocol + '://' + req.get('host') + '/password_change';

      mysql.pool.query('UPDATE User SET recovery_code=? WHERE email=?', [recoveryCode, email], function(err, rows, fields) {
        if (err) {
          console.log(err);
          next(err);
          return;
        }

        /* START email */
        nodemailer.createTestAccount((err, account) => {
          // Source: https://nodemailer.com/about/
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });

          let mailOptions = {
            from: '"Team Phoenix" <' + process.env.EMAIL_ADDRESS + '>',
            to: email,
            subject: 'Employee Recognition System Password Recovery',
            html: 
            'Dear Customer,<br><br>' +
            'To reset your password, please click <a href="' + fullURL + '">here</a>' +
            '.<br>' + 
            'Your recovery code is: ' + recoveryCode + '<br><br>' +
            'If you did not request for a password reset, please ignore this email.'
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          })
          res.status(200).send('Email sent to ' + email);
        });
        /* END email */

      });
      
    } else { // User not found
      res.status(404).send('User not found');
    }
  });
});

module.exports = router;
