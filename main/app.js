var express = require('express');
var fs = require('fs')
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(cookieParser());
app.use(partials());

app.get('/', function (req, res){
  res.render('index');
})

app.get('/resume', function (req, res){
  res.download(path.resolve(__dirname, 'Resume2014Fall.pdf'))
})

module.exports = app;
