var db = require('../lib/db');
var validate = require('mongoose-validator').validate;

/**
 * makes a mongodb schema which is what each entry in the 
    database looks like.
*/
var UserSchema = new db.Schema({
    username : {
        type: String, 
        required: true,
        validate: validate('len', 1, 3)
    }
    , highscore : Number
});
var MyUser = db.mongoose.model('User', UserSchema);


// Add user to database
/**
 * takes in two strings (a username and a highscore) and 
    and calls the mongoose method save to store those two
    entries as a single object in the mongo database
 * returns the user saved or an error
*/
var addUser = function(username, highscore, callback) {
    var instance = new MyUser();
    instance.username = username;
    instance.highscore = highscore;
    instance.save(function (err) {
        if (err) {
            callback(err, null);
            console.log("Failed to add highscore");
        }
        else {
            callback(null, instance);
            console.log(instance);
        }
    });
}

/**
 * Calls the mongoose function find
 * returns a collection of highscores and usernames or null
    (if there is an error)
*/
var getTopHighscore =  function (callback){
    
    MyUser.find(
        null, 
        null, 
        {
            limit: 10,
            sort:{
                highscore: -1
            }
        }, 
        function(err, collection){
            if(err != null){
                callback(err, null);
                console.log("Failed to find highscores");
            }
            else{
                callback(null,collection);
            }
    });
}

/**
 * Calls the mongoose function find but this time only looks at
    usernames which is given.
 * returns a collection of highscores and usernames or null
    (if there is an error)
*/
var findOneHighscore = function(username,callback){
     MyUser.find(
        {username: username}, 
        null, 
        {
            limit: 10,
            sort:{
                highscore: -1
            }
        }, 
        function(err, collection){
            if(err != null){
                callback(err, null);
                console.log("Failed to find highscores");
            }
            else{
                callback(null,collection);
            }
    });
}

// Exports
/**
 * This three exports have to go after their declaration above.
*/
module.exports.addUser = addUser;
module.exports.getTopHighscore = getTopHighscore;
module.exports.findOneHighscore = findOneHighscore;