var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.u_type == 'normal') {
    console.log(req.session.secret);
		res.render('users', { title: 'User Page' }); // If user has session, direct to /users
	} else {
		res.redirect('/'); // If not, go back to login page
	}
});

module.exports = router;

