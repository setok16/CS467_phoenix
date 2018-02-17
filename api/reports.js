var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

router.get('/usersbytype',
	function(req, res, next) {

		var jsonData = {
			"cols": [
				{
					"id": "",
					"label": "User Type",
					"pattern": "",
					"type": "string"
				}, {
					"id": "",
					"label": "Total",
					"pattern": "",
					"type": "number"
				}
			],
			"rows": [
				{
					"c": [
						{
							"v": "admin"
						}, {
							"v": 15
						}
					]
				}, {
					"c": [
						{
							"v": "normal"
						}, {
							"v": 150
						}
					]
				}, {
					"c": [
						{
							"v": "unknow"
						}, {
							"v": 170
						}
					]
				}

			]
		};

		//var data = [
		//	{
		//		"admin": 15
		//	},
		//	{
		//		"normal": 150
		//	}
		//];

		res.send(jsonData);
	});

router.get('/awardsbyuser', function(req, res, next) {
	var data2dArray = [
		['George Washington', 17, 55],
		['Harry Potter', 27, 22],
		['Uma Thurman', 28, 19],
		['Clyde Drexler', 15, 7],
		['Barak Obama', 11, 11]
	];
	res.send(data2dArray);
});

router.get('/awardsbytype', function (req, res, next) {
	//todo: not working
	var data2dArray = [
			[
				{ label: 'Award', type: 'string' },
				{ label: 'Total', type: 'number' }
			],
		['weekly', 85],
		['monthly', 150],
		['yearly', 11]
	];
	res.send(data2dArray);
});

module.exports = router;