var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	if (req.session.email) {  // Redirect client to appropriate pages if they're already logged in
		if (req.session.u_type == 'normal') {
			res.redirect('/users');
		} else if (req.session.u_type == 'admin') {
			res.redirect('/admin');
		}
	}

	res.render('index', {
		title: 'Login',
		hideNav: 'hidden',
		customHeader: '<link href="stylesheets/signin.css" rel="stylesheet" />'
	}
	);
});

module.exports = router;
