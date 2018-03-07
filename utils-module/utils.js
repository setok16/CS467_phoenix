var nodemailer = require('nodemailer');
var dotenv = require('dotenv').config();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

module.exports = {

  sendEmail: function(emailAddress, subject, body, attachments = 0) {
    return new Promise((resolve, reject) => {
      
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
          to: emailAddress,
          subject: subject,
          html: body,
        };
        if (attachments) {
          mailOptions.attachments = attachments;
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('Message sent: %s', info.messageId);
            //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            resolve();
          }
        });
      });
    });
  },

  passwordIsValid: function(pass1, pass2) {

    if (pass1 !== pass2 || 
        !pass1.length > 8 ||
        !pass1.match(/[0-9]/i) ||
        !pass1.match(/[a-z]/i) ||
        !pass1.match(/[A-Z]/i)) {
      return false;
    } else {
      return true;
    }
  },
  
  emailIsAvailable: function(email) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT false available FROM User where email = ? LIMIT 1", [email],
        function (err, rows, fields) {
          if (err) {
            reject(err);
          } else {
            var available = true;
            if (rows.length > 0)
              available = false;
            resolve(available);
          }
        });
    });
  }

};
