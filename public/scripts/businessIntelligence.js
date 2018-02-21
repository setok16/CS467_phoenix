// Load the Visualization API and the corechart package.
//google.charts.load('current', { packages: ['calendar'] });
google.charts.load('current', { packages: ['corechart', 'table', 'bar', 'charteditor'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
//google.charts.setOnLoadCallback(drawAwardCalendarChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

function drawChart() {
	//http://localhost:3000/api/reports/usertypes/
	// Create the data table.

	drawUserTypeChart();
	drawUsersTable();
	drawAwardsTable();
	drawAwardTypeChart();
	drawAwardsDomainChart();
	drawAwardsByUserChart();
	drawAwardsCalendarTable();

}


function drawAwardsCalendarTable() {
		var apiData = [
		[
			{ label: 'Recipient', type: 'string' },
			{ label: 'Award Type', type: 'string' },
			{ label: 'Issuer', type: 'string' },
			{ label: 'Granted', type: 'date' }
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

	var data = [
		['Domain', 'Weekly', 'Monthly'],
		['gmail', 15, 3],
		['ymail', 3, 15],
		['aol', 1, 12],
		['unknown', 25, 55],
		['oregonstate', 17, 17]
	];

	var apiData;
	try {
		const response = await axios.get('/api/reports/awards/domain');
		apiData = response.data;
	} catch (error) {
		console.log(error);
		return;
	}

	console.log("APIDATA:" + apiData);

	var data = google.visualization.arrayToDataTable(apiData);

	function countWordMatch(values, word) {
		var countWords = 0;
		values.forEach(function(element) {
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
		[{ 'column': 1, 'label': 'Month', 'pattern': 'month', 'aggregation': countMonthMatch, 'type': 'number' },
			{ 'column': 1, 'label': 'Week', 'pattern': 'week', 'aggregation': countWeekMatch, 'type': 'number' }]
	);
// google.visualization.data.count
	console.log("RESULT:" + result);

	var options = {
		//chart: {
		//	title: 'Award By Domain'
		//},
		//'width': '500',
		//'height': '500',
		//'chartArea': { 'width': '50%', 'height': '50%' },
		hAxis: {
			title: 'Total Awards',
			minValue: 0
		},
		vAxis: {
			title: 'Domain'
		},
		bars: 'horizontal', // Required for Material Bar Charts.
		isStacked: true
	};

	var chart = new google.charts.Bar(document.getElementById('chart_award_domain'));

	chart.draw(result, google.charts.Bar.convertOptions(options));
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
