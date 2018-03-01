var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;
var moment = require('moment-timezone');
const latex = require('node-latex');
const fs = require('fs');
const fse = require('fs-extra')
const path = require('path');
var lescape = require('escape-latex');
var sendEmail = require('../utils-module/utils.js').sendEmail;
var manageAwards = require('../utils-module/manage_awards.js')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

let signature_local_for_awards = null;

// Function: validateNormalUserForAwards
var validateNormalUserForAwards = function (req, res, next) {
	//console.log("Exectuing validateNormalUserForAwards");
	
	if (req.session.u_type == 'normal') { // If user has session and session variable shows a normal user

		// Check if session variable u_id exists
		if (!req.session.u_id) {
			return res.status(401).send('u_id does not exist');
		}
        else {
			// Compare user data with those in db
			pool.query("CALL selectUserByID(?)", [req.session.u_id], function(err, result, fields) {
	
				if (err) {	// Database connection error
					console.log(err);
					return res.status(500).send('Database Connection Error');
				}
				else if (result[0].length != 1) {	// No user with u_id = req.session.u_id in db
					return res.status(401).send('Invalid u_id');
				}
				else if (result[0][0]['creation_datetime'] != req.session.creation_datetime) {
                    // creation timestamp doesn't match
					return res.status(401).send('Invalid user - creation timestamp does not match');
				}
				else {	// User exists. Compare session variables with db data
					if (result[0][0]['email'] != req.session.email) {
						req.session.email = result[0][0]['email'];
					}
					if (result[0][0]['fname'] != req.session.fname) {
						req.session.fname = result[0][0]['fname'];
					}
					if (result[0][0]['lname'] != req.session.lname) {
						req.session.lname = result[0][0]['lname'];
					}
					signature_local_for_awards = (result[0][0]['signature']).toString().replace('data:image/png;base64,', '');
					req.session.save(function(err) {
						next();
					});
				}
				
			});
        }
	} else if (req.session.u_type == 'admin') {
		return res.status(401).send('admin user - should not visit here');
	} else {
        return res.status(401).send('no user info');
    }
};


// Router: POST '/'
router.post('/',

    // check fields
    body('award_type').isIn(['week', 'month']).withMessage('Award type must be either "week" or "month".'),
	body('award_fname').trim().isLength({ min: 1 }).withMessage('First name must be specified.'),
    body('award_lname').trim().isLength({ min: 1 }).withMessage('Last name must be specified.'),
    body('award_email').isEmail().withMessage('Email must be a valid email address.'),
    body('award_datetime').isISO8601().withMessage('Award date & time must be a valid ISO 8601 datetime.'),

	// sanitize fields
	sanitizeBody('award_fname').trim(),
    sanitizeBody('award_lname').trim(),
    sanitizeBody('award_email').trim(),
	
	// validate user
	validateNormalUserForAwards,

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
			// Data from form is valid. Submit to Award table in database
			pool.query("CALL addAwardThenSelectID(?,?,?,?,?,?)", [
                req.body.award_type,
                req.session.u_id,
                req.body.award_fname,
                req.body.award_lname,
                req.body.award_email,
                req.body.award_datetime
            ],
				function(mysql_err, result, fields) {
					if (mysql_err) {
						console.log(mysql_err);
						//res.setHeader('Content-Type', 'text/event-stream');
						res.status(500).send("Award creation failed. " + mysql_err);
            			return;
					}
					else {
                        //console.log(result[0][0]['added_award_id']);
                        let created_c_id = result[0][0]['added_award_id'];
						console.log("Award created in db: " + created_c_id);
						
						let award_type = req.body.award_type;
						let receiver_full_name = req.body.award_fname + ' ' + req.body.award_lname;
						let receiver_email = req.body.award_email;
						let award_datetime = req.body.award_datetime;
						let award_date = award_datetime.substr(0, award_datetime.indexOf(' '));
						let user_full_name = req.session.fname + ' ' + req.session.lname;

						let receiver_full_name_lescaped = lescape(receiver_full_name);
						let user_full_name_lescaped = lescape(user_full_name);

						let signature_filename = "sig_for_award_" + created_c_id + ".png";
						let signature_pathname = path.join(__dirname, '..', 'certs', signature_filename);

						// Write to the sig_for_award_#.png file
						fs.writeFile(signature_pathname, signature_local_for_awards, 'base64', (writeSigFileError) => {
							if (writeSigFileError) {
								console.log(writeSigFileError);
								if(fs.existsSync(signature_pathname)) {
									fs.unlinkSync(signature_pathname);
								}
								manageAwards.deleteAward(created_c_id)
									.then(function() {
										res.status(500).send("Writing signature image failed. " + writeSigFileError);
									}).catch(function(err) {
										res.status(500).send("Writing signature image failed. " + writeSigFileError
										+ "\nAward deletetion failed. " + err);
									});
							}
							else {
								// Read the template tex file - cert_template.tex
								fs.readFile(
									path.join(__dirname, '..', 'certs', 'template', 'cert_template.tex'),
										'utf8', (readTexFileError, cert_template_tex) => {
										if (readTexFileError) {
											console.log(readTexFileError);
											fs.unlinkSync(signature_pathname);
											manageAwards.deleteAward(created_c_id)
												.then(function() {
													res.status(500).send("TeX template file cannot be read. " + readTexFileError);
												}).catch(function(err) {
													res.status(500).send("TeX template file cannot be read. " + readTexFileError
													+ "\nAward deletetion failed. " + err);
												});
											return;
										}
										var cert_tex = cert_template_tex
											.replace('[Week or Month]', award_type)
											.replace('[Full Name of the Receiver]', receiver_full_name_lescaped)
											.replace('[signature_filename]',
												signature_pathname.replace(/\\/g, "/"))
											.replace('[Award Grant Date]', award_date)
											.replace('[Full Name of the User]', user_full_name_lescaped)
										;

										//For debugging only
										//fs.writeFileSync(path.join(__dirname, '..', 'certs',
										//	'certificate_'+created_c_id+'.tex'), cert_tex);

										let certificate_pdf_filename = "cert_" + created_c_id + ".pdf";
										let certificate_pdf_pathname = path.join(__dirname, '..', 'certs', certificate_pdf_filename);
										
										// Compile LaTeX file and write to pdf
										const certificate_pdf_output = fs.createWriteStream(certificate_pdf_pathname);

										const certificate_pdf = latex(cert_tex);
										certificate_pdf.pipe(certificate_pdf_output);

										certificate_pdf.on('error', (latexError) => {
											console.error(latexError);
											fs.unlinkSync(signature_pathname);

											if(fs.existsSync(certificate_pdf_pathname)) {
												fs.unlinkSync(certificate_pdf_pathname);
											}

											manageAwards.deleteAward(created_c_id)
												.then(function() {
													res.status(500).send("Failed to generate the PDF certificate. " + latexError);
												}).catch(function(err) {
													res.status(500).send("Failed to generate the PDF certificate. " + latexError
													+ "\nAward deletetion failed. " + err);
												});
										});

										certificate_pdf.on('finish', () => {
											console.log('PDF generated.');

											// Temporary behavior: Move pdf to /public/pdf_certificates
											//fs.renameSync(certificate_pdf_pathname, path.join(__dirname, '..',
											//	'public', 'pdf_certificates', certificate_pdf_filename));

											// Send email to receiver
											let email_subject = 'Employee Recognition System - Award Certificate';
											let email_html =
												"<p>Dear " + receiver_full_name + ",</p>" +
												'<p style="margin-top:1.5em;">Congratulations on receiving the <strong>STAR OF THE ' + award_type.toUpperCase() +
												"</strong> award! As you know, this is an award provided to the employee " +
												"who I believe contributed the most during the " + award_type + ".</p>" +
												'<p>Attached please find the certificate that is specifically made for you. ' +
												"Also please let me know if you have questions or need additional information.</p>"+
												'<p style="margin-bottom:1.5em;">Thank you so much for your contribution, and once again, warm congratulations.</p>' +
												'<p>Best regards,<br>' + user_full_name + "</p>";
											let email_attachments = [{
												filename: "Employee_Recognition_Certificate.pdf",
												path: certificate_pdf_pathname
											}];

											let sendEmailPromise = sendEmail(receiver_email, email_subject, email_html, email_attachments);

											sendEmailPromise.then(function() {
												console.log('sendEmail(): Email sent to receiver.');
												// remove files in /certs
												//fs.unlinkSync(certificate_pdf_pathname);
												fs.unlinkSync(signature_pathname);
											
												res.setHeader('Content-Type', 'application/json');
												res.status(200).send(JSON.stringify({ "pdf_filename": certificate_pdf_filename }));
											}).catch(function(sendEmailError) {
												console.log('sendEmail(): ' + sendEmailError);

												Promise.all([
													fse.remove(certificate_pdf_pathname),
													fse.remove(signature_pathname),
													manageAwards.deleteAward(created_c_id)
												]).then(function() {
													console.log("Email sending failed. Files & Award deleted.");
													res.status(500).send("Email sending failed. " + sendEmailError);
												}).catch(function(err) {
													console.log("Email sending failed. File(s) or Award deletion failed. " + err);
													res.status(500).send("Email sending failed. " + sendEmailError
														+ "\nAward deletetion failed. " + err);
												});
											});
											
											
										});
									}
								);
							}
						});

					
					}
			});

		}
	}
);



module.exports = router;