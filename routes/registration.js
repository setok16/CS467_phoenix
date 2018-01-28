var express = require('express');
var router = express.Router();
var signaturePad = require('signature_pad');

/* GET registration page */
router.get('/', function(req, res, next) {
	var context = {
		title: 'Registration',
	};
	res.render('registration', context);
});

module.exports = router;
