
// Load the Visualization API and the corechart package.
//google.charts.load('current', { packages: ['calendar'] });
google.charts.load('current', { packages: ['corechart', 'table', 'bar', 'charteditor', 'controls'] });

// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);
//google.charts.setOnLoadCallback(drawAwardCalendarChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
//// draws it.

//$('#pills-user').on('shown.on.tab', google.charts.setOnLoadCallback(drawUserVisuals));
//$('#pills-awards').on('shown.on.tab', google.charts.setOnLoadCallback(drawAwardVisuals));

//$('#pills-user-tab').click(google.charts.setOnLoadCallback(drawUserVisuals));
//$('#pills-awards-tab').click(google.charts.setOnLoadCallback(drawAwardVisuals));

function drawChart() {

	$('#pills-user').on('shown.on.tab', drawUserVisuals());
	$('#pills-awards').on('shown.on.tab', drawAwardVisuals());

	//drawUserVisuals();
	//drawAwardVisuals();

	//http://localhost:3000/api/reports/usertypes/
	// Create the data table.

	//drawUserTypeChart();
	//drawUsersTable();
	
	//drawAwardsTable();
	//drawAwardTypeChart();
	//drawAwardsDomainChart();
	
	//drawAwardsByUserChart();
	//drawAwardsCalendarTable();

}


function drawAwardsCalendarTable() {
		var apiData = [
		[
			{ label: 'Recipient', type: 'string' },
			{ label: 'Award Type', type: 'string' },
			{ label: 'Issuer', type: 'string' },
			{ label: 'Date Granted', type: 'date' }
		],
		['Fred', 'weekly', 'Julia', 'Date(2018, 2, 27)'],
		['Jim', 'weekly', 'Tom', 'Date(2018, 2, 27)'],
		['Alice', 'monthly', 'Teresa', 'Date(2018, 2, 27)'],
		['Bob', 'monthly', 'Sophia', 'Date(2018, 2, 27)']
	];

	var data = new google.visualization.arrayToDataTable(apiData);

	var formatter_short = new google.visualization.DateFormat({ formatType: 'short' });

	formatter_short.format(data, 3);

	var table = new google.visualization.Table(document.getElementById('chart_awards_calendar_table'));

	table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
}

async function drawAwardsByUserChart() {

	//var jsonData =
	//[
	//	['User', 'Weekly', 'Monthly'],
	//	['George Washington', 17, 55],
	//	['Harry Potter', 27, 22],
	//	['Uma Thurman', 28, 19],
	//	['Clyde Drexler', 15, 1]
	//];

	var apiData;

	try {
		const response = await axios.get('/api/reports/awardsbyuser/chartdata');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.DataTable();
	data.addColumn('string', 'User');
	data.addColumn('number', 'weekly');
	data.addColumn('number', 'monthly');
	data.addRows(apiData);

	var options = {
		'width': 700,
		'height': 700,
		legend: { position: 'right' },
		bar: { groupWidth: '75%' },
		isStacked: true
	};

	var chart = new google.visualization.ColumnChart(document.getElementById("chart_user_awards"));
	chart.draw(data, options);
};


async function drawAwardsDomainChart() {

	var apiData;
	try {
		const response = await axios.get('/api/reports/awards/domain');
		apiData = response.data;
	} catch (error) {
		console.log(error);
		return;
	}

	var data = google.visualization.arrayToDataTable(apiData);

	function countWordMatch(values, word) {
		var countWords = 0;
		values.forEach(function (element) {
			if (element.toLowerCase() === word.toLowerCase()) {
				countWords += 1;
			}
		});
		return countWords;
	}

	function countMonthMatch(values) {
		return countWordMatch(values, 'month');
	}

	function countWeekMatch(values) {
		return countWordMatch(values, 'week');
	}

	var result = google.visualization.data.group(
		data,
		[0],
		[
			{ 'column': 1, 'label': 'Month', 'pattern': 'month', 'aggregation': countMonthMatch, 'type': 'number' },
			{ 'column': 1, 'label': 'Week', 'pattern': 'week', 'aggregation': countWeekMatch, 'type': 'number' }
		]
	);
	// google.visualization.data.count
	console.log("RESULT:" + result);

	var options = {
		width: 1000,
		height: 500,
		isStacked: true
	};

	var chart = new google.visualization.ColumnChart(document.getElementById("chart_award_domain"));
	chart.draw(result, options);
}
async function drawAwardTypeChart() {


	var apiData;
	try {
		const response = await axios.get('/api/reports/awards/type');
		apiData = response.data;
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.arrayToDataTable(apiData);

	// Set chart options
	var options = {
		'width': '700',
		'height': '700',
		'chartArea': { 'width': '100%', 'height': '95%' }
		//is3D: true
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_award_type'));
	chart.draw(data, options);

}
async function drawAwardsTable() {

	var apiData;

	try {
		const response = await axios.get('/api/reports/awards/table');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.arrayToDataTable(apiData);

	var formatter_short = new google.visualization.DateFormat({ formatType: 'short' });
	formatter_short.format(data, 4);

	var table = new google.visualization.Table(document.getElementById('chart_awards_table'));

	table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
}

async function drawAwardVisuals() {
	var apiData;

	try {
		const response = await axios.get('/api/reports/awards/table');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}
	
	var data = new google.visualization.arrayToDataTable(apiData);

	var formatter_short = new google.visualization.DateFormat({ formatType: 'short' });
	formatter_short.format(data, 4);
	
	//create a dashboard
	var dashboard = new google.visualization.Dashboard(
		document.getElementById('awards_dashboard'));

	//create a range slider
	var dateRangeSlider = new google.visualization.ControlWrapper({
		'controlType': 'DateRangeFilter',
		'containerId': 'filter_awards_by_date',
		'options': {
			'filterColumnLabel': 'Date Granted',
			//'formatType': 'short'
			'ui': {
				format: {pattern: "MM/dd/yyyy"}
			},
			'state': {
				//'lowThumbAtMinimum': true,
				'highThumbAtMaximum': true,
				'lowValue': new Date(1970, 01, 01),
				'highValue': new Date(2070, 1, 1)
			} 
	},
		//'ui': { 'label': 'Award Date' },
		//'state': { 'lowThumbAtMinimum': true, 'highThumbAtMaximum': true} //
		//'state': {
		//	'lowValue': new Date(1970, 01, 01),
		//	'highValue': new Date(2070, 1, 1)
		//}
		//setting state and control title are not working
	});

	//create a range slider
	var awardCategoryPicker = new google.visualization.ControlWrapper({
		'controlType': 'CategoryFilter',
		'containerId': 'filter_awards_by_type',
		'options': {
			'filterColumnLabel': 'Award Type',
			'ormatTyp': 'short',
			'ui': {
				'label': 'Award Type',
				'allowTyping': false,
				'allowMultiple': false,
				'selectedValuesLayout': 'belowStacked'
			}
		},
		//'ui': { 'label': 'Award Date' },
		//'state': { lowThumbAtMinimum: true, highThumbAtMaximum: true} //
		//state: { 'lowValue': '1970-01-01', 'highValue': '2070-1-1' }
		//setting state and control title are not working
	});

	var tableWrapper = new google.visualization.ChartWrapper({
		chartType: 'Table',
		//	dataTable: result,
		options: { showRowNumber: false, width: '100%', height: '100%' },
		containerId: 'chart_awards_table'
	});

	var options = {
		width: 1000,
		height: 500,
		isStacked: true
	};


	google.visualization.events.addListener(tableWrapper, 'ready', function () {
		var chart = new google.visualization.ColumnChart(document.getElementById("chart_award_domain"));
		var aggregatedData = google.visualization.data.group(
			tableWrapper.getDataTable(),
			[5],
			[
				{ 'column': 2, 'label': 'Month', 'pattern': 'month', 'aggregation': countMonthMatch, 'type': 'number' },
				{ 'column': 2, 'label': 'Week', 'pattern': 'week', 'aggregation': countWeekMatch, 'type': 'number' }
			]
		);
		chart.draw(aggregatedData, options);
	});


	dashboard.bind([dateRangeSlider, awardCategoryPicker], tableWrapper);
	dashboard.draw(data);

}

async function drawUserVisuals() {
	var apiData;

	try {
		const response = await axios.get('/api/reports/usersbytype/tabledata');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.arrayToDataTable(apiData);

	
	var userTypePicker = new google.visualization.ControlWrapper({
		'controlType': 'CategoryFilter',
		'containerId': 'filter_uses_by_type',
		'options': {
			'filterColumnLabel': 'User Type',
			'ui': {
				'label': 'User Type',
				'allowTyping': false,
				'allowMultiple': false,
				'selectedValuesLayout': 'belowStacked'
			}
		}
	});

	var tableWrapper = new google.visualization.ChartWrapper({
		chartType: 'Table',
		options: { showRowNumber: false, width: '100%', height: '100%' },
		containerId: 'table_user_type'
	});

	var options = {
		'width': '700',
		'height': '700',
		'chartArea': { 'width': '100%', 'height': '100%' }
	};


	google.visualization.events.addListener(tableWrapper, 'ready', function () {
		var chart = new google.visualization.PieChart(document.getElementById("chart_user_domain"));
		var aggregatedData = google.visualization.data.group(
			tableWrapper.getDataTable(),
			[4],
			[
				{ 'column': 0, 'label': 'Month', 'pattern': 'month', 'aggregation': google.visualization.data.count, 'type': 'number' }
			]
		);
		chart.draw(aggregatedData, options);
	});


	//put everything together is a dashboard
	var dashboard = new google.visualization.Dashboard(
		document.getElementById('users_dashboard'));

	dashboard.bind(userTypePicker, tableWrapper);
	dashboard.draw(data);


	
}

async function drawUsersTable() {

	var apiData;

	try {
		const response = await axios.get('/api/reports/usersbytype/tabledata');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.arrayToDataTable(apiData);

	//var formatter_short = new google.visualization.DateFormat({ formatType: 'short' });

	//formatter_short.format(data, 4);

	var table = new google.visualization.Table(document.getElementById('table_user_type'));

	table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
}

async function drawUserTypeChart() {

	var apiData;
	
	try {
		const response = await axios.get('/api/reports/usersbytype/chartdata');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}
	
	var data = new google.visualization.arrayToDataTable(apiData);

	// Set chart options
	var options = {
		'width': '700',
		'height': '700',
		'chartArea': { 'width': '100%', 'height': '95%' }
		//is3D: true
	};
	
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_user_type'));
	chart.draw(data, options);
}


function countWordMatch(values, word) {
	var countWords = 0;
	values.forEach(function (element) {
		if (element.toLowerCase() === word.toLowerCase()) {
			countWords += 1;
		}
	});
	return countWords;
}

function countMonthMatch(values) {
	return countWordMatch(values, 'month');
}

function countWeekMatch(values) {
	return countWordMatch(values, 'week');
}

function isEmptyOrSpaces(str) {
	return str === null || str.match(/^ *$/) !== null;
}

async function displaySearchAndDisplayResults(formId, searchResultElementId) {

	var resultElement = document.getElementById(searchResultElementId);
	var warningElement = resultElement.getElementsByTagName('DIV')[0];
	var resultTable = document.getElementById(searchResultElementId).getElementsByTagName('TABLE')[0];


	var form = document.getElementById(formId);
	var formData = new FormData(form);

	var queryString = "?";

	for (var pair of formData.entries()) {
		if (!isEmptyOrSpaces(pair[1]))
		queryString += "&" + pair[0] + "=" + pair[1];
	}
	if (queryString === "?") {
		warningElement.style.visibility = "visible";
		resultTable.style.visibility = "collapse";
		return;
	}

	var apiData;

	try {
		const response = await axios.get('/api/awards'+queryString);
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

		if (apiData.length < 1) {
		warningElement.style.visibility = "visible";		
		resultTable.style.visibility = "collapse";
		return;
	}
	warningElement.style.visibility = "collapse";		
	resultTable.style.visibility = "visible";

	var newTableBody = document.createElement('tbody');

	apiData.forEach(function(element) {
		var row = newTableBody.insertRow(0);
		row.innerHTML = '<td scope="col">' + element.fname + ' ' + element.lname + '</td>' +
			'<td scope="col">' + element.email + '</td>' +
			'<td scope="col">' + element.award_type + '</td>' +
			'<td scope="col">' + element.issuer_email + '</td>' +
			'<td scope="col">' + element.granted_date + '</td>';
	});

	var oldTableBody = resultTable.getElementsByTagName('TBODY')[0];

	oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
}