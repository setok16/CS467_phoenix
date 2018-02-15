var express = require('express');
var router = express.Router();

/*
Should specify the following session variables before redirecting to this location:

req.session.user_error_message (string)
req.session.user_redirect_message (string)
req.session.redirect_location (string)
req.session.timeout_ms (int)
*/

router.get('/', function(req, res) {

    if (req.session.user_error_message) {
        var userErrorMsg = req.session.user_error_message;
        var userRedirectMsg = req.session.user_redirect_message;
        var redirectLoc = req.session.redirect_location;
        var timeout = req.session.timeout_ms;
    
        delete req.session.user_error_message;
        delete req.session.user_redirect_message;
        delete req.session.redirect_location;
        delete req.session.timeout_ms;
    
        res.render('users_error', {
            title: 'User Account - Error',
            error_message: userErrorMsg,
            redirect_message: userRedirectMsg,
            redirect_location: redirectLoc,
            timeout_ms: timeout
        });
    
    } else {
        res.render('users_error', {
            title: 'User Account - Error',
            redirect_message: 'Logging out in 5 seconds.',
            redirect_location: '/logout',
            timeout_ms: 5000
        });
    }
    
});


module.exports = router;