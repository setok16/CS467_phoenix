var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.u_type == 'normal') {
		res.render('users', { title: 'User Account', session: { fname: req.session.fname, lname: req.session.lname } }); // If user has session, direct to /users
	} else {
		res.redirect('/'); // If not, go back to login page
	}
});

module.exports = router;

