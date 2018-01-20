var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

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

app.listen(app.get('port'), function() {
	console.log('Server started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
