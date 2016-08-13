 var express = require('express')
 , http = require('http')
 , path = require('path')
 , User = require('./models/User.js')
 , fs = require('fs')
 , _ = require('underscore')
 , Backbone = require('backbone')
 , exphbs = require('express3-handlebars');

 var app = express();

/**
 * All the environments
 * This is all auto-generated
 * app.set('port') => this line is where you can specify the port
    at which the app runs on.
*/
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * This method reads the index.html file in the public directory.
    if the current URL is the index page '/'.
*/
app.get('/', function(req, res){
  fs.readFile('./bonified/public/index.html', function(error, content){
    if(error){
      res.writeHead(500);
      res.end();
    }
    else{
      res.writeHead(200, { 'Content-Type': 'text/html'});
      // console.log(content)
      res.end(content, 'utf-8');
    }
  });
});

/**
 * Sends the frontend the result of calling User.getTopHighscore
    which is a multi-layered JSON object
 * User is a User model from the models/User.js file.
 * getTopHighscore is a mongoose method from the models folder.
*/
app.get('/getHighScores', function(req,res){

  User.getTopHighscore(function(err, collection){
    if(err != null){
      console.log("ERRORRRR!!!!");
      res.send(err);
    }
    else{
      console.log("Collection is gotten");
      res.send(collection);
    }
  });
});

/**
 * Receives a username from the frontend and calls findOneHighscore
    to find all the highscores that specific uses has entered
    in the database. It then sends the frontend a multi-layered JSON
    object.
 * User is a User model and findOneHighscore is a mongoose method,
    both are form the models/User.js file
*/
app.post('/search', function(req, res){
  var username = req.body.username;
  User.findOneHighscore(username, function(err, collection){

    if(err != null){
      console.log("ERRORRRR!!!!");
      res.send(err);
    }
    else{
      console.log(collection);
      res.send(collection);
    }
  });
});

/**
 * Receives a username and a highscore from the frontend and calls
    addUser which posts those two pieces of info into the mongoDB
    database. It then sends the frontend a status of success or
    fail.
 * User is a User model and findOneHighscore is a mongoose method,
    both are form the models/User.js file
*/
app.post('/addHighScore', function(req, res) {
  var username = req.body.username;
  var highscore = req.body.highscore;
  console.log(highscore);
  User.addUser(username, highscore, function(err, user) {
    if(err != null){
      res.send(err);
    }
    else{
      res.send(user);
    }

  });
});

module.exports = app;
