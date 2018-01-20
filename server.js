var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', server_port);

app.get('/', function(request, result) {
	result.render('home');
});

app.get('/hello', function(request, result) { // Example page to be removed later
	var context = {};
	context.time = (new Date(Date.now())).toLocaleTimeString('en-US');
	result.render('hello', context);
});

app.use(function(request, result) {
	result.status(404);
	result.render('404');
});

app.use(function(error, request, result, next) {
	console.error(error.stack);
	result.type('plain/text');
	result.status(500);
	result.render('500');
});

app.listen(server_port, server_ip_address);
console.log('Server running on http://%s:%s', server_ip_address, server_port);
