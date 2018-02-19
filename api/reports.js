var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

router.get('/usersbytype/:resulttype',
	function(req, res, next) {

		if (req.params.resulttype.toLowerCase() === 'chartdata') {
			//create array and set headers
			var googleChartData = [];

			googleChartData.push([
				{ id: "u_type", label: "User Type", type: "string" },
				{ id: "total", label: "Total", type: "number" }
			]);

			pool.query("SELECT u_type, count(u_id) as Total from User Group by u_type",
				function (err, rows) {
					if (err) {
						console.log(err);
					} else {
						rows.forEach(function (element) {
							googleChartData.push([element.u_type, element.Total]);
						});
						res.send(googleChartData);
					}
				});
		} else if (req.params.resulttype.toLowerCase() === 'tabledata') {
			//create array and set headers
			var googleTabletData = [];

			googleTabletData.push([
				{ id: "email", label: "Email", type: "string" },
				{ id: "fname", label: "First Name", type: "string" },
				{ id: "lname", label: "Last Name", type: "string" },
				{ id: "u_type", label: "User Type", type: "string" },
				{ id: "domain", label: "Domain", type: "string" }
			]);

			pool.query(
				"SELECT email, lname, fname, u_type, creation_datetime from User ORDER BY email;",
				function(err, rows) {
					if (err) {
						console.log(err);
					} else {
						rows.forEach(function (element) {
							googleTabletData.push([element.email, element.lname, element.fname, element.u_type, GetEmailParts(element.email).domain ]);
						});
						res.send(googleTabletData);
					}
				});
		} else {
			res.send([]);
		}
	});

router.get('/awardsbyuser/:resulttype', function (req, res, next) {

	if (req.params.resulttype.toLowerCase() === 'chartdata') {
		var data2dArray = [
			['George Washington', 17, 55],
			['Harry Potter', 27, 22],
			['Uma Thurman', 28, 19],
			['Clyde Drexler', 15, 7],
			['Barak Obama', 11, 11]
		];
		res.send(data2dArray);
	} else if (req.params.resulttype.toLowerCase() === 'tabledata') {

		var apiData = [
			[
				{ label: 'Recipient', type: 'string' },
				{ label: 'Award Type', type: 'string' },
				{ label: 'Issuer', type: 'string' },
				{ label: 'Granted', type: 'date' }
			],
			['Mike', 'weekly', 'Julia', 'Date(2018, 2, 27)'],
			['Jim', 'weekly', 'Tom', 'Date(2018, 2, 27)'],
			['Alice', 'monthly', 'Teresa', 'Date(2018, 2, 27)'],
			['Bob', 'monthly', 'Sophia', 'Date(2018, 2, 27)']
		];

		res.send(apiData);
	}
	{
		res.send([]);
	}
});

router.get('/awardsbytype/:resulttype', function (req, res, next) {

	if (req.params.resulttype.toLowerCase() === 'chartdata') {
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
	} else if (req.params.resulttype.toLowerCase() === 'tabledata') {

		var apiData = [
			[
				{ label: 'Recipient', type: 'string' },
				{ label: 'Award Type', type: 'string' },
				{ label: 'Issuer', type: 'string' },
				{ label: 'Granted', type: 'date' }
			],
			['Mike', 'weekly', 'Julia', 'Date(2018, 2, 27)'],
			['Jim', 'weekly', 'Tom', 'Date(2018, 2, 27)'],
			['Alice', 'monthly', 'Teresa', 'Date(2018, 2, 27)'],
			['Bob', 'monthly', 'Sophia', 'Date(2018, 2, 27)']
		];

		res.send(apiData);
	} else
	{
		res.send([]);
	}

});


function GetEmailParts(strEmail) {
	// Set up a default structure with null values 
	// incase our email matching fails.
	var objParts = {
		user: null,
		domain: null,
		ext: null
	};

	// Get the parts of the email address by leveraging
	// the String::replace method. Notice that we are 
	// matching on the whole string using ^...$ notation.
	strEmail.replace(
		new RegExp("^(.+)@(.+)\\.(\\w+)$", "i"),

		// Send the match to the sub-function.
		function ($0, $1, $2, $3) {
			objParts.user = $1;
			objParts.domain = $2;
			objParts.ext = $3;
		}
	);

	// Return the "potentially" updated parts structure.
	return (objParts);
}

module.exports = router;