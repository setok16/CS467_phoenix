var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

router.get('/usertypes',
	function(req, res, next) {

		var data = [
			{
				"admin": 15
			},
			{
				"normal": 150
			}
		];

		res.send(JSON.stringify(data));
	});

module.exports = router;