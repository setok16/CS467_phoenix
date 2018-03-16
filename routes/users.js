var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
//var moment = require('moment');
var moment = require('moment-timezone');
var passwordValidator = require('password-validator');
var bcrypt = require('bcrypt');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var validateNormalUser = require('../utils-module/validateNormalUser.js');

// Router: PATCH '/editName'
router.patch('/editName',

    // check fields
    body('input_fname').trim().isLength({ min: 1 }).withMessage('First name must be specified.'),
    body('input_lname').trim().isLength({ min: 1 }).withMessage('Last name must be specified.'),

    // sanitize fields
    sanitizeBody('input_fname').trim(),
    sanitizeBody('input_lname').trim(),
    
    // validate user
    validateNormalUser,

    // Process request after validation and sanitization
    function(req, res) {
        
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${location}[${param}]: ${msg}`;
        };
        var validattion_errors = validationResult(req).formatWith(errorFormatter);

        if (!validattion_errors.isEmpty()) {
            // There are errors
            console.log(validattion_errors.array().toString());
            //res.setHeader('Content-Type', 'text/event-stream');
            res.status(400).send(validattion_errors.array().toString());
            return;
        }
        else {
            // Data from form is valid. Update database entry
            pool.query("CALL changeUserNameByID(?,?,?)", [req.session.u_id, req.body.input_fname, req.body.input_lname],
                function(err, result, fields) {
                    if (err) {
                        //res.setHeader('Content-Type', 'text/event-stream');
                        res.status(500).send(err);
                        return;
                    }
                    else {
                        //console.log(result);
                        //res.setHeader('Content-Type', 'text/event-stream');
                        res.status(200).send('Name changed successfully!');
                        // must send some string for 'fetch' to process on the client side
                    }
            });

        }
    }
);



// Router: PATCH '/updateSig'
router.patch('/updateSig',

    // validate user
    validateNormalUser,

    // Process request
    function(req, res) {
        
        pool.query("CALL changeSignatureByID(?,?)", [req.session.u_id, req.body.input_sig_blob],
            function(err, result, fields) {
                if (err) {
                    //res.setHeader('Content-Type', 'text/event-stream');
                    res.status(500).send(err);
                       return;
                }
                else {
                    //console.log(result);
                    //res.setHeader('Content-Type', 'text/event-stream');
                    res.status(200).send('Signature changed successfully!');
                    // must send some string for 'fetch' to process on the client side
                }
        });

    }
);


// Router: PATCH '/changePwd'
router.patch('/changePwd',

    // password validation should have been completed on the client side
    
    // validate user
    validateNormalUser,

    // Process request after validation and sanitization
    function(req, res) {
        
        var pwdValidator = new passwordValidator();
        pwdValidator
            .is().min(8)			// Minimum length 8 
            .is().max(50)			// Maximum length 50 
            .has().uppercase()		// Must have uppercase letters 
            .has().lowercase()		// Must have lowercase letters 
            .has().digits()			// Must have digits 
            .has().not().spaces();	// Should not have space

        if ( (!req.body.input_pwd) || (!req.body.input_pwd_verify) ) {
            console.log("Error: No passwords received.");
            //res.setHeader('Content-Type', 'text/event-stream');
            res.status(400).send("New passwords must be specified.");
            return;
        }
        else if (req.body.input_pwd !== req.body.input_pwd_verify) {
            console.log("Error: Received passwords do not match.");
            //res.setHeader('Content-Type', 'text/event-stream');
            res.status(400).send("Passwords do not match.");
            return;
        }
        else if (pwdValidator.validate(req.body.input_pwd) == false) {
            // Password didn't pass validation
            var failedPwdRequirements = pwdValidator.validate(req.body.input_pwd,  { list: true });
            console.log('Error: Failed password requirements: ' + failedPwdRequirements);
            //res.setHeader('Content-Type', 'text/event-stream');
            res.status(400).send('Failed to meet password requirements: ' + failedPwdRequirements);
            return;
        }
        else {
            // Password from form is valid. Bcrypt the password
            bcrypt.hash(req.body.input_pwd, 10, function(err, hash) {
                // Store hash in password DB
                if (err) {
                    console.log(err);
                    //res.setHeader('Content-Type', 'text/event-stream');
                    res.status(500).send(err);
                    return;
                }
                else {
                    pool.query("CALL changePwdByID(?,?)", [req.session.u_id, hash],
                        function(mysql_err, result, fields) {
                        if (mysql_err) {
                            console.log(mysql_err);
                            //res.setHeader('Content-Type', 'text/event-stream');
                            res.status(500).send(mysql_err);
                            return;
                        }
                        else {
                            //console.log(result);
                            //res.setHeader('Content-Type', 'text/event-stream');
                            res.status(200).send('Password changed successfully!');
                            // must send some string for 'fetch' to process on the client side
                        }
                    });
                }
            });
            

        }
    }
);

// Router: PATCH '/changeEmail'
router.patch('/changeEmail',

    // check email format
    body('input_email').isEmail().withMessage('Must be an email address'),
    
    // sanitize email
    sanitizeBody('input_email').trim(),

    // validate user
    validateNormalUser,

    // Process request after validation and sanitization
    function(req, res) {
        
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${location}[${param}]: ${msg}`;
        };
        var validattion_errors = validationResult(req).formatWith(errorFormatter);

        if (!validattion_errors.isEmpty()) {
            // There is an email format errors
            console.log(validattion_errors.array().toString());
            //res.setHeader('Content-Type', 'text/event-stream');
            res.status(400).send(validattion_errors.array().toString());
            return;
        }
        else {

            // Check if new email address is available
            pool.query("CALL selectUserByEmail(?)", [req.body.input_email],
                function(err, result, fields) {
                    if (err) {	// database returned error
                        //res.setHeader('Content-Type', 'text/event-stream');
                        res.status(500).send(err);
                        return;
                    }
                    else if (result[0].length > 0) {	// email already exists
                        res.status(409).send("Email address unavailable");
                        return;
                    }
                    else {	// process the email change in the database
                        //console.log(result);
                        pool.query("CALL changeEmailByID(?,?)", [req.session.u_id, req.body.input_email],
                            function(change_email_err, change_email_result, change_email_fields) {
                                if (change_email_err) {	// database returned error
                                    //res.setHeader('Content-Type', 'text/event-stream');
                                    res.status(500).send(change_email_err);
                                    return;
                                }
                            else {	// successful
                                //console.log(change_email_result);
                                //res.setHeader('Content-Type', 'text/event-stream');
                                res.status(200).send('Email changed successfully!');
                                // must send some string for 'fetch' to process on the client side
                            }
                        });
                    }
            });
            

        }
    }
);

// Router: GET '/'
router.get('/', validateNormalUser, function(req, res) {

    // Format the creation timestamp
    //console.log(req.session.creation_datetime);
    var creation_datetime_formatted = moment(req.session.creation_datetime).format('llll');
    //console.log(creation_datetime_formatted);

    // Calculate the number of days since registration
    var now_in_pacific = moment.tz(new Date(), 'US/Pacific');
    var creation_datetime_in_pacific = moment.tz(req.session.creation_datetime, 'US/Pacific');
    var days = now_in_pacific.diff(creation_datetime_in_pacific, 'days');
    //console.log(days);

    // Store the signature to be inserted to the .hbs html file
    var signature_inserted_to_html = '';

    if (res.locals.signature_local) {	// signature is not Null
        signature_inserted_to_html = '<img class="img-fluid" src="' + res.locals.signature_local + '"/>';
    } else {	// signature is Null
        signature_inserted_to_html = 'No signature on file.';
    }

    // Import user-created awards
   // console.log("checking Award db");
    pool.query("CALL selectAwardByUserID(?)", [req.session.u_id], function(err, award_result, fields) {

        if (err) {	// Database connection error
            console.log(err);
            res.render('users_error', {
                title: 'User Account - Error',
                error_message: 'Award table connection failed.',
                redirect_message: 'Logging out in 5 seconds.',
                redirect_location: '/logout',
                timeout_ms: 5000
            });
        }
        else {
            let user_num_of_awards = award_result[0].length;

            var context = {};
            context = {
                title: 'User Account',
                session: {
                    email: req.session.email,
                    fname: req.session.fname,
                    lname: req.session.lname,
                    timestamp: creation_datetime_formatted,
                    signature: signature_inserted_to_html,
                    elapsed_days: days,
                    userAwardsRow: award_result[0],
                    num_of_awards: user_num_of_awards
                },
                showProfileTab: 1,
                customHeader: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table.min.css">',
                customScript: '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table.min.js"></script>\n' +
                    '<script src="/scripts/signature_pad/dist/signature_pad.min.js"></script>\n' +
                    '<script src="/public/scripts/normalUser/userProfileFunctions.js"></script>\n' +
                    '<script src="/public/scripts/normalUser/createAwardFunction.js"></script>\n' +
                    '<script src="/public/scripts/normalUser/deleteUserAwardFunction.js"></script>\n'
            
            };

            if (req.query.tab == 'awards') { // use /users?tab=awards in the URL to first display the awards tab
                context.showProfileTab = 0;
            }

            //console.log("Exectuing user page rendering");
            res.render('users.hbs', context);
        }

    });
    
    
});


module.exports = router;