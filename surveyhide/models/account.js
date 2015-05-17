var mongoose = require('mongoose')
, Schema = mongoose.Schema
, passportLocalMongoose = require('passport-local-mongoose')
, Survey = require('./survey');

var Account = new Schema({
	firstName: String
	, lastName: String
	, email: {type: String, unique: true}
	, phoneNumber: String
	, lastLogin: { type: Date, default: Date.now }
	, surveys: []
});

Account.plugin(passportLocalMongoose);

var MyAcc = mongoose.model('Account', Account);

/** 
 * setAccountInfo
 *
 * @param {string} - id, surveyId
 * @param {string} - name, firstname
 * @param {string} - lastName, lastname
 * @param {string} - email, email
 * @param {string} - phone, phonenumber
 * @param {callback}
 *
 * updates the account's first/last name, email and phonenumber with 'id'
 */
var setAccountInfo = function(id, name, lastName, email, phone, cb){
	MyAcc.findByIdAndUpdate(
		id,
		{
			firstName: name,
			lastName: lastName,
			email: email,
			phoneNumber: phone
		},
		cb);
};
/** 
 * setEmail
 *
 * @param {string} - id, surveyId
 * @param {string} - email, email
 * @param {cb}
 *
 * sets the account with 'id' email field to 'email' 
 */
var setEmail = function(id, email, cb){
	MyAcc.findByIdAndUpdate(
		id,
		{
			email: email
		},
		cb);
};
/** 
 * setLastLogin
 *
 * @param {string} - id, surveyId
 * @param {string} - time, Date
 * @param {cb}
 *
 * sets the account with 'id' last login time to 'time'
 */
var setLastLogin = function(id, time, cb){
	MyAcc.findByIdAndUpdate(
		id,
		{
			lastLogin: time
		},
		cb);
};

/** 
 * getAccByEmail
 *
 * @param {string} - emailReq, email
 * @param {callback}
 *
 * finds an account object by email
 */
var getAccByEmail = function(emailReq, callback){
	MyAcc.findOne(
		{email: emailReq},
		null,
		callback
		);
};
/** 
 * authenticate2
 *
 * authenticates a user/email and password
 */
var authenticate2 = function(){

	var self = this;

	return function (username, password, cb) {
		self.findByUsername(username, function (err, user) {

			if (err) {return cb(err);}
			if (user) {
				return user.authenticate(password, cb);
			} else {
				self.getAccByEmail(username, function (err, emailer){
					if (emailer) {
						return emailer.authenticate(password, cb);
					} else {
						return cb(null, false, { message: 'Invalid login credentials' });
					}
				});
			}
		});
	}
}

/** 
 * accountByID
 *
 * @param {string} - id, surveyId
 * @param {callback}
 *
 * gets an account by its ID.
 */
var accountByID = function(id, callback) {
	MyAcc.findById(
		id
		,null
		,callback);	
};
/** 
 * findAllUsernames
 *
 * @param {cb}
 *
 * finds all the account objects
 */
var findAllUsernames = function(cb){
	MyAcc.find(
		null,
		null,
		cb
		);
};
/** 
 * getAccountByUser
 *
 * @param {string} - user, username
 * @param {cb}
 *
 * finds the account object with username 'user'
 */
var getAccountByUser = function(user, cb){
	MyAcc.findOne(
		{ username: user},
		null,
		cb
		);
}
/** 
 * addSurvey
 *
 * @param {string} - survey, surveyID
 * @param {string} - user, username
 * @param {cb}
 *
 * pushes a surveyID to the account with a username of 'user'
 */
var addSurvey = function(survey, user, cb){
	MyAcc.findOne(
		{ username: user }
		,null
		,function (err, result){
			if(err){cb(err,null)}
				else{
					result.surveys.push(survey);
					result.save(function (err2){cb(err2)});
				}
			}
			);
}

module.exports = mongoose.model('Account', Account);
module.exports.setAccountInfo = setAccountInfo;
module.exports.setEmail = setEmail;
module.exports.setLastLogin = setLastLogin;
module.exports.authenticate2 = authenticate2;
module.exports.getAccByEmail = getAccByEmail;
module.exports.accountByID = accountByID;
module.exports.findAllUsernames = findAllUsernames;
module.exports.getAccountByUser = getAccountByUser;
module.exports.addSurvey = addSurvey;