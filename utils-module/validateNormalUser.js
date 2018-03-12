var mysql = require('../dbcon.js');
var pool = mysql.pool;

// Middleware Function: validateNormalUser
module.exports = function (req, res, next) {
	//console.log("Exectuing validateNormalUserForAwards");
	
	if (req.session.u_type == 'normal') { // If user has session and session variable shows a normal user

		// Check if session variable u_id exists
        if ( (!req.session.u_id) || typeof(req.session.u_id)!=='number' ||
            (!isFinite(req.session.u_id)) || req.session.u_id % 1 !== 0 || req.session.u_id < 0) {
            console.log('u_id does not exist or is invalid');
            if (req.method == "GET") {
                return res.redirect('/logout');
            }
            else {
                return res.status(403).send('u_id does not exist or is invalid');
            }
		}
        else {
			// Compare user data with those in db
			pool.query("CALL selectUserByID(?)", [req.session.u_id], function(err, result, fields) {
	
				if (err) {	// Database connection error
                    console.log('User database connection failed: ' + err);
                    
                    if (req.method == "GET") {
                        req.session.user_error_message = 'User database connection failed.';
					    req.session.user_redirect_message = 'Logging out in 5 seconds.';
					    req.session.redirect_location = '/logout';
					    req.session.timeout_ms = 5000;

					    req.session.save(function(e) {
						    res.redirect('/users_error');
					    });
                    }
                    else {
                        return res.status(500).send('Database Connection Error');
                    }
					
				}
                else if (result[0].length != 1) {	// No user with u_id = req.session.u_id in db
                    console.log('User does not exist');
                    if (req.method == "GET") {
                        req.session.user_error_message = 'User does not exist.';
					    req.session.user_redirect_message = 'Logging out in 5 seconds.';
					    req.session.redirect_location = '/logout';
					    req.session.timeout_ms = 5000;

					    req.session.save(function(e) {
						    res.redirect('/users_error');
					    });
                    }
                    else {
                        return res.status(403).send('Invalid u_id');
                    }
					
				}
				else if (result[0][0]['creation_datetime'] != req.session.creation_datetime) {
                    // creation timestamp doesn't match
                    console.log('User creation timestamp does not match');
                    if (req.method == "GET") {
                        req.session.user_error_message = 'User creation timestamp does not match.';
					    req.session.user_redirect_message = 'Logging out in 5 seconds.';
					    req.session.redirect_location = '/logout';
					    req.session.timeout_ms = 5000;

					    req.session.save(function(e) {
					    	res.redirect('/users_error');
					    });
                    }
                    else {
                        return res.status(403).send('Invalid user - creation timestamp does not match');
                    }
					
				}
                else {	// User exists. Compare session variables with db data
                    console.log('User validated');
					if (result[0][0]['email'] != req.session.email) {
						req.session.email = result[0][0]['email'];
					}
					if (result[0][0]['fname'] != req.session.fname) {
						req.session.fname = result[0][0]['fname'];
					}
					if (result[0][0]['lname'] != req.session.lname) {
						req.session.lname = result[0][0]['lname'];
                    }
                    res.locals.signature_local = result[0][0]['signature'];
					req.session.save(function(err) {
						next();
					});
				}
				
			});
        }
	} else if (req.session.u_type == 'admin') {
        if (req.method == "GET") {
            res.redirect('/admin'); // If user has session but is an admin user, direct to /admin
        }
        else {
            return res.status(403).send('admin user - should not visit here');
        }
		
	} else {
        if (req.method == "GET") {
            res.redirect('/'); // If there is no session, go back to login page
        }
        else {
            return res.status(403).send('no user info');
        }
    }
};