google.charts.load('current', { packages: ['corechart', 'table', 'bar', 'charteditor', 'controls', 'sankey' ] });

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
			'ui': {
				format: { pattern: "MM/dd/yyyy" }
			},
			'state': {
				'highThumbAtMaximum': true,
				'lowValue': new Date(1970, 01, 01),
				'highValue': new Date(2070, 1, 1)
			}
		}
	});

	//create a range slider
	var awardCategoryPicker = new google.visualization.ControlWrapper({
		'controlType': 'CategoryFilter',
		'containerId': 'filter_awards_by_type',
		'options': {
			'filterColumnLabel': 'Award Type',
			//'ormatTyp': 'short',
			'ui': {
				'caption': 'All awards',
				'label': 'Award Type',
				'allowTyping': false,
				'allowMultiple': false
			}
		}
	});

	var tableWrapper = new google.visualization.ChartWrapper({
		chartType: 'Table',
		//	dataTable: result,
		options: { showRowNumber: false, width: '100%', height: '100%' },
		containerId: 'chart_awards_table'
	});

	google.visualization.events.addListener(tableWrapper, 'ready', function () {
		var options = {
			width: 1000,
			height: 500,
			isStacked: true
		};

		var chart = new google.visualization.ColumnChart(document.getElementById("chart_award_recipient_domain"));
		var aggregatedData = google.visualization.data.group(
			tableWrapper.getDataTable(),
			[6],
			[
				{ 'column': 2, 'label': 'Month', 'pattern': 'month', 'aggregation': countMonthMatch, 'type': 'number' },
				{ 'column': 2, 'label': 'Week', 'pattern': 'week', 'aggregation': countWeekMatch, 'type': 'number' }
			]
		);
		chart.draw(aggregatedData, options);
	});

	google.visualization.events.addListener(tableWrapper, 'ready', function () {
		var options = {
			width: 1000,
			height: 500,
			isStacked: true
		};

		var chart = new google.visualization.ColumnChart(document.getElementById("chart_award_issuer_domain"));
		var aggregatedData = google.visualization.data.group(
			tableWrapper.getDataTable(),
			[7],
			[
				{ 'column': 2, 'label': 'Month', 'pattern': 'month', 'aggregation': countMonthMatch, 'type': 'number' },
				{ 'column': 2, 'label': 'Week', 'pattern': 'week', 'aggregation': countWeekMatch, 'type': 'number' }
			]
		);
		chart.draw(aggregatedData, options);
	});

	google.visualization.events.addListener(tableWrapper, 'ready', function () {
		var options = {
			width: 1000,
			height: 500
		};
		var chart = new google.visualization.Sankey(document.getElementById("chart_award_user_domain"));

		var aggregatedData = google.visualization.data.group(
			tableWrapper.getDataTable(),
			[{ column: 7, modifier: suffixRecipient, type: 'string' }, 6],
			[
				{ 'column': 6, 'label': 'Count', 'aggregation': google.visualization.data.count, 'type': 'number' }
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
		const response = await axios.get('/api/reports/users/table');
		apiData = response.data;
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
				'caption': 'All awards',
				'label': 'User Type',
				'allowTyping': false,
				'allowMultiple': false
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

function suffixRecipient(value) {
	return appendSuffix(value, '');
}

function appendSuffix(value, suffix) {
	return suffix + " " + value;
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