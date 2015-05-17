var path = require('path')
, express = require('express')
, http = require('http')
, mongoose = require('mongoose')
, passport = require('passport')
, flash = require('connect-flash')
, LocalStrategy = require('passport-local').Strategy;

var app = express();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', { layout: false });

	//app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser('daosakdoadkaidjsaidjsaidjsadk2mel2mek32lm32lksadjsaldksa'));
	app.use(express.session());

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));


});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Configure passport
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate2()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var Results = require('./models/results');
var Survey = require('./models/survey');

// Connect mongoose
mongoose.connect('mongodb://surveyhide:'+process.env.SURVEYHIDE+'@ds031822.mongolab.com:31822/surveyhide');

// Setup routes
require('./loginServer')(app);
require('./surveyServer')(app);
require('./statServer')(app);
require('./teamServer')(app);
require('./profileServer')(app);

module.exports = app;
