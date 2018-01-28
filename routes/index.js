var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Some Page',
		hideNav: 'hidden',
		customHeader: '<link href="stylesheets/signin.css" rel="stylesheet" />'
	}
	);
});

function removeNavigation() {
	document.getElementById("meunbutton").style.display = 'none';
	document.getElementById("navgroup").style.display = 'none';
} 

module.exports = router;
