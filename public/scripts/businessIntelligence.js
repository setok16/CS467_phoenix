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
	drawAwardsByUserChart();

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
		const response = await axios.get('/api/reports/awardsbyuser');
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
		const response = await axios.get('/api/reports/awardsbytype');
		apiData = response.data;
	} catch (error) {
		console.log(error);
		return;
	}

	var data = new google.visualization.arrayToDataTable(apiData);
	//data.addColumn('string', 'Award Type');
	//data.addColumn('number', 'Total');
	//data.addRows(apiData);
	//data.addRows([
	//	['weekly', 15],
	//	['monthly', 150]
	//]);

	// Set chart options
	var options = {
		'width': 700,
		'height': 700,
		is3D: true
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_award_type'));
	chart.draw(data, options);
}

async function drawUserTypeChart() {

	//var jsonData = [
	//	[
	//		{ label: 'User', type: 'string' },
	//		{ label: 'Total', type: 'number' }
	//	],
	//	['admin', 15],
	//	['normal', 150],
	//	['unknown', 10]
	//];

	//var data = new google.visualization.arrayToDataTable(jsonData);


	var apiData;
	
	try {
		const response = await axios.get('/api/reports/usersbytype');
		apiData = response.data;
		//console.log(response.data);
	} catch (error) {
		console.log(error);
		return;
	}

	var data2 = new google.visualization.DataTable(apiData);

	// Set chart options
	var options = {
		'width': 700,
		'height': 700,
		is3D: true
	};
	
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_user_type'));
	chart.draw(data2, options);
}
