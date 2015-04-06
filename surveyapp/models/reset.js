var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var reset = new Schema({
	userID: String,
	//86400000ms = 24 hours.
	isValid: {type: Date, default: (Date.now() + 86400000) },
	isUsed: String
});

myReset = mongoose.model('reset', reset);

/** 
 * createReset
 *
 * @param {string} - userID, Account ID
 * @param {callback}
 *
 * creates a reset object
 */
var createReset = function(userID, callback){
    var instance = new myReset();
    instance.userID = userID;
    instance.save(function(err){
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, instance);
        }
    });
}

/** 
 * queryResetsByID
 *
 * @param {string} - resetID, reset object id
 * @param {callback}
 *
 * checks if the reset ID is valid or not
 */
var queryResetsByID = function(resetID, callback){
    myReset.findOne(
        {_id : resetID},
        null,
        {
        },
        function(err, collection){
            if(err != null){
                callback(err, null);
            }
			
			
            else{
			if (Date.now() > collection.isValid) {
			callback(err,null);
			}
			else if (collection.isUsed === ' Yes')
				{
				callback(err, null);
				}
			
			else
			{
				collection.isUsed = 'Yes'
				collection.save(function(err){
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, collection);
					}
				});
				
			}
            }
        }
        );
};

module.exports = mongoose.model('reset', reset);
module.exports.createReset = createReset;
module.exports.queryResetsByID = queryResetsByID;