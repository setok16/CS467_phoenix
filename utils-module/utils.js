var nodemailer = require('nodemailer');
var dotenv = require('dotenv').config();

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
  }
};
