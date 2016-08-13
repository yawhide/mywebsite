
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

// Connect to cloud database

/**
 * We used mongoLab to host our mongo database.
 * in the url0 variable we needed to specify an address provided
    by mongolab
*/
var username = process.env.BONIFIED_USERNAME;
var localUsername = "localhost";
var password = process.env.BONIFIED_PASSWORD;
var localPassword = "27017";
var address = '@ds047458.mlab.com:47458/rememberalldb';
var localAddress = "/rememberalldb";
connect();

// Connect to mongo
function connect() {
    var url0 = 'mongodb://' + username + ':' + password + address;
    // var url1 = 'mongodb://' + localUsername + ':' + localPassword + localAddress;

    mongoose.connect(url0);
    console.log("Database connected!");
}
function disconnect() {
  mongoose.disconnect();
}

