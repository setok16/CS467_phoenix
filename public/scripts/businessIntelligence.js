// Load the Visualization API and the corechart package.
//google.charts.load('current', { packages: ['calendar'] });
google.charts.load('current', { packages: ['corechart', 'table', 'bar'] });

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
	drawAwardTypeChart();
	drawAwardsDomainChart();
	drawAwardsByUserChart();
	drawAwardsCalendarTable();
	drawAwardsTable();

}

function drawAwardsDomainChart()
{
	var data = google.visualization.arrayToDataTable([
		['Domain', 'Weekly', 'Monthly'],
		['gmail', 15, 3],
		['ymail', 3, 15],
		['aol', 1, 12],
		['unknown', 25, 55],
		['oregonstate', 17, 17]]);

	var options = {
		chart: {
			title: 'Award By Domain',
			subtitle: 'Awards by recipient email domain'
		},
		bars: 'horizontal' // Required for Material Bar Charts.
	};

	var chart = new google.charts.Bar(document.getElementById('chart_award_domain'));

	chart.draw(data, google.charts.Bar.convertOptions(options));
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

async function drawAwardTypeChart() {


	var apiData;
	try {
		const response = await axios.get('/api/reports/awardsbytype/chartdata');
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
		const response = await axios.get('/api/reports/awardsbytype/tabledata');
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
