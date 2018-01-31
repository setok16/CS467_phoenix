var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	//res.send('respond with a resource');
	if (req.session.u_type == 'admin') {
		res.render('admin', { title: 'Admin Page' });
	} else { // Going back to login page if user is not logged in
		res.redirect('/');
	}

});

module.exports = router;
