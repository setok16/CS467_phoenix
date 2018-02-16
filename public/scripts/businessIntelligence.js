// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.


// Load the Visualization API and the piechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	//http://localhost:3000/api/reports/usertypes/
	// Create the data table.

	drawUserTypeChart();
	drawAwardTypeChart();
	drawUserAwardsChart();

}

function drawUserAwardsChart() {

	var jsonData =
	[
		['User', 'Weekly', 'Monthly'],
		['George Washington', 17, 55],
		['Harry Potter', 27, 22],
		['Uma Thurman', 28, 19],
		['Clyde Drexler', 15, 1]
	];

	var data = google.visualization.arrayToDataTable(jsonData);

	var options = {
		width: 600,
		height: 400,
		legend: { position: 'right' },
		bar: { groupWidth: '75%' },
		isStacked: true
	};

	var chart = new google.visualization.ColumnChart(document.getElementById("chart_user_awards"));
	chart.draw(data, options);
};

function drawAwardTypeChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Award Type');
	data.addColumn('number', 'Total');
	data.addRows([
		['weekly', 15],
		['monthly', 150]
	]);

	// Set chart options
	var options = {
		'title': 'Award Types',
		'width': 500,
		'height': 500,
		is3D: true
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_award_type'));
	chart.draw(data, options);
}

function drawUserTypeChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'User Type');
	data.addColumn('number', 'Total');
	data.addRows([
		['admin', 15],
		['normal', 150]
	]);
	//data.addRows([
	//	['Mushrooms', 3],
	//	['Onions', 1],
	//	['Olives', 1],
	//	['Zucchini', 1],
	//	['Pepperoni', 2]
	//]);

	// Set chart options
	var options = {
		'title': 'User Types',
		'width': 500,
		'height': 500,
		is3D: true
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_user_type'));
	chart.draw(data, options);
}
