var express = require('express');
var router = express.Router();
var mysql = require('../dbcon.js');
var pool = mysql.pool;

router.get('/',renderAdminPage);

async function renderAdminPage (req, res) {
		if (req.session.u_type === 'admin') {

			var context = {};

			context.customHeader = '<link href="stylesheets/modal-override.css" rel="stylesheet"/>';
			context.customHeader += '<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.16/datatables.min.css"/>';

			context.customScript =
				'<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/dt-1.10.16/datatables.min.js"></script>';
			context.customScript += '<script src="public/scripts/emailAvailability.js"></script>';
			context.customScript += '<script src="public/scripts/passwordComplexity.js"></script>';
			context.customScript += '<script src="public/scripts/adminFunctions.js"></script>';
			context.customScript += '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>';
			context.customScript += '<script src="public/scripts/businessIntelligence.js"></script>';

			
			context.title = 'Admin Account';
			context.session = { email: req.session.email, u_id: req.session.u_id };

			if (req.query) {
				if (req.query.tab === 'admin') {
					context.showAdminTab = 'show active';
				} else if (req.query.tab === 'report') {
					context.showReportTab = 'show active';
				} else {
					context.showNormalTab = 'show active';
				}
			} else {
				context.showNormalTab = 'show active';
			}

			pool.query("CALL selectUserByUserType(?)",
				['normal'],
				function (err, rows, fields) {
					if (err) {
						console.log(err);
						context.userData = [];
						context.countUsers = 0;
					} else
					{
						context.userData = rows[0];
						context.countUsers = rows[0].length;
					}
					pool.query("CALL selectUserByUserType(?)", ['admin'],
						function (err, rows, fields) {
							if (err) {
								console.log(err);
								context.adminData = rows[0];
								context.countAdmin = 0;
							} else {
								context.adminData = rows[0];
								context.countAdmin = rows[0].length;
							}
							return res.render('admin', context);
						});
				});
			
		} else { // Going back to login page if user is not logged in
			res.redirect('http://' + req.headers.host + '/');
		}
	
}

module.exports = router;
