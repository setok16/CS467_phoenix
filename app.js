var express = require('express');
var methodOverride = require('method-override');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var dotenv = require('dotenv').config();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var usersApi = require('./api/users');
var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var registration = require('./routes/registration');
var login = require('./routes/login');
var passwordRecovery = require('./routes/passwordRecovery');
var passwordChange = require('./routes/passwordChange');
var logout = require('./routes/logout');
//var router = express.Router();

var app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride('X-HTTP-Method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_STORE_URL })
}))
app.use(express.static(path.join(__dirname, 'public')));

// Using to include packages directly from node_modules into views
app.use('/scripts', express.static(__dirname + '/node_modules'));
// Using as path to public
app.use('/public', express.static(__dirname + '/public'));

app.use('/', index);
app.use('/api/users', usersApi);
app.use('/users', users);
app.use('/admin', admin);
app.use('/registration', registration);
app.use('/login', login);
app.use('/password_recovery', passwordRecovery);
app.use('/password_change', passwordChange);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (res.finished) return;
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
