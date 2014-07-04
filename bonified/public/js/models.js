/**
 * makes a backbone user model. This will be called from backbone
    to call the nodejs app.get('/getHighScores', ...) method to
    get all the specified user's highscores
*/
var User = Backbone.Model.extend({
    url: 'bonified/getHighScores'
});

/**
 * makes a backbone singleUser model. This will be called from backbone
    to call the nodejs app.get('/search', ...) method which will
    get the top 10 highscores from the mongodb
*/
var SingleUser = Backbone.Model.extend({
    url: 'bonified/search'
});

/**
 * makes a backbone user model. This will be called from backbone
    to call the nodejs app.get('/addHighScore', ...) method which
    will add a highscore to the mongodb 
*/
var AddUser = Backbone.Model.extend({
    url: 'bonified/addHighScore'
});
