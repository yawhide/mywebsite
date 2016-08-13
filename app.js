var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var _ = require('underscore');
var partials = require('express-partials');

var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

app.use(favicon());
app.use(require('morgan')('dev'));

// app.use('/projectsobeys', require('./projectsobeys/app'))
app.use('/bonified', require('./bonified/app'))
// app.use('/playground', require('./playground/app'))
// app.use('/surveyhide', require('./surveyhide/app'))
// app.use('/ms2bosstimers', require('./ms2bosstimer/app'))
app.use(require('./main/app'))

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      console.log(err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
  app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port + ", NODE_ENV=" + app.get('env'));
});
