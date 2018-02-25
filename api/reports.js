var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

function validateAdminUser(req, res, next) {
	if (!req.session || req.session.u_type !== 'admin' || !req.session.u_id) {
		res.status(403).send();
		return;
	}
	pool.query("CALL selectUserByID(?)",
		[req.session.u_id],
		function (err, rows, fields) {
			if (err) {
				console.log('DB ERROR: ' + err);
				res.status(403).send();
			} else if (rows[0].length < 1) {
				console.log("no users found for u_id");
				res.status(403).send();
				return;
			} else if (rows[0][0].u_type.toLowerCase() !== 'admin') {
				console.log("u_type is not admin");
				res.status(403).send();
			} else {
				next();
			}
			return;
		});
};

router.all('/*', validateAdminUser);

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
				{ id: "domain", label: "User Domain", type: "string" }
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

		////create array and set headers
		//var googleChartData = [];

		//googleChartData.push([
		//	{ id: "u_type", label: "User Type", type: "string" },
		//	{ id: "total", label: "Total", type: "number" }
		//]);

		//pool.query("SELECT u_type, count(u_id) as Total from User Group by u_type",
		//	function (err, rows) {
		//		if (err) {
		//			console.log(err);
		//		} else {
		//			rows.forEach(function (element) {
		//				googleChartData.push([element.u_type, element.Total]);
		//			});
		//			res.send(googleChartData);
		//		}
		//	});

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

router.get('/awards/:resulttype',
	function(req, res, next) {

		if (req.params.resulttype.toLowerCase() === 'type') {
			var googleTabletData = [];

			googleTabletData.push([
				{ id: 'award', label: 'Award', type: 'string' },
				{ it: 'total', label: 'Total', type: 'number' }]
			);

		pool.query(
			"SELECT c_type award, COUNT(c_id) as total " +
			"FROM Award " +
			"GROUP BY c_type",
			function (err, rows) {
				if (err) {
					console.log(err);
				} else {
					rows.forEach(function (element) {
						googleTabletData.push([element.award, element.total]);
					});
					res.send(googleTabletData);
				}
			});

	} else if (req.params.resulttype.toLowerCase() === 'table') {

		var googleTabletData = [];

		googleTabletData.push([
			{ id: 'receiver_fullname', label: 'Recipient', type: 'string' },
			{ id: 'receiver_email', label: 'Recipient Email', type: 'string' },
			{ id: 'c_type', label: 'Award Type', type: 'string' },
			{ id: 'issuer', label: 'Issuer', type: 'string' },
			{ id: 'granted_datetime', label: 'Date Granted', type: 'date' },
			{ id: "domain", label: "User Domain", type: "string" }
		]);

		pool.query(
			"SELECT receiver_email, receiver_lname, receiver_fname, c_type, YEAR(granted_datetime) as granted_year, MONTH(granted_datetime) as granted_month, DAY(granted_datetime) as granted_day , u.fname, u.lname " +
			"FROM Award a " +
			"LEFT JOIN User u on a.user_id = u.u_id " +
			"ORDER BY a.receiver_lname;",
			function (err, rows) {
				if (err) {
					console.log(err);
				} else {
					rows.forEach(function (element) {
						googleTabletData.push([element.receiver_fname + " " + element.receiver_lname, element.receiver_email, element.c_type, element.fname + " " + element.lname
							, 'Date('+element.granted_year+','+element.granted_month+','+element.granted_day+')'
							, GetEmailParts(element.receiver_email).domain]);
					});
					res.send(googleTabletData);
				}
			});
		} else if (req.params.resulttype.toLowerCase() === 'domain') {

			var googleTabletData = [];
			googleTabletData.push([
				{ id: "domain", label: "User Domain", type: "string" },
				{ id: 'c_type', label: 'Award Type', type: 'string' },
				{ id: 'granted_datetime', label: 'Granted', type: 'date' }
			]);

			pool.query(
				"SELECT receiver_email, " +
				"c_type, " +
				"YEAR(granted_datetime) as granted_year, MONTH(granted_datetime) as granted_month, DAY(granted_datetime) as granted_day  " +
				"FROM Award a ",
				function (err, rows) {
					if (err) {
						res.send(err);
					} else {
						rows.forEach(function (element) {
							googleTabletData.push([
								GetEmailParts(element.receiver_email).domain,
								element.c_type,
								'Date(' + element.granted_year + ',' + element.granted_month + ',' + element.granted_day + ')'
							]);
						});
						res.send(googleTabletData);
					}
				});
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
		domain: 'unknown',
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