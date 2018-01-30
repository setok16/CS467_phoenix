var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function(req, res, next) {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
			next(err);
			return;
		}
		res.redirect('/');
	});
});

module.exports = router;
