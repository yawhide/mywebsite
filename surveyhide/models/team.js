var mongoose = require('mongoose')
, Schema = mongoose.Schema
, Survey = require('./survey')
, passportLocalMongoose = require('passport-local-mongoose');

var Team = new Schema({
	teamName: {type: String, unique:true}
	, teamOwner: String
	, teamUsers: [ String ]
	, survey: [ String ]
});

myTeam = mongoose.model('team', Team);

/** 
 * queryTeamName
 *
 * @params {string} -title, teamName
 *
 * gets all the teams sorted by teamname whos teamname is title
 */
var queryTeamName = function(title, callback){
	myTeam.find(
		{teamName : new RegExp(title, 'i')}
		,null
		,callback);
};

/** 
 * addUser
 *
 * @params {user object, String} callback
 *
 * Adds a username to the teamusers array inside a team object
 *	searches via username owner
 */
var addUser = function(teamName, userName, cb){
	/** $addToSet already checks for duplicates and if there is a duplicate,
	 * 		it will just not push it to the array 
	 */
	myTeam.findOneAndUpdate(
		{teamName : teamName}
		, { $addToSet: { teamUsers: userName}} 
		, cb)
}

/** 
 * makeTeam
 *
 * @params {String, String} callback
 *
 * makes a team and initializes teamOwner and teamName
 */
var makeTeam = function(owner, teamName, cb){
	var ins = myTeam();
	ins.teamOwner = owner;
	ins.teamName = teamName;
	ins.teamUsers = [];
	ins.teamUsers.push(owner);
	ins.surveys = [];
	ins.save(function (err, ins){
		cb(err, ins)
	}
		);
}

/** 
 * addSurvey
 *
 * @params {survey object, String} callback
 *
 * adds a survey to the survey array, searches by teamname
 */
var addSurvey = function(survey, teamName, cb){
	
	myTeam.findOneAndUpdate(
		{teamName : teamName}
		, { $push: { survey: survey._id}}
		,cb)
}

/** 
 * getTeamsByUser
 *
 * @params {String} callback
 *
 * finds a single team by username (owner)
 */
var getTeamsByUser = function(user, cb){
	myTeam.find(
		{ teamUsers : user}
		, null
		, cb)
}

/** 
 * getTeamByName
 *
 * @params {String} callback
 *
 * finds a single team by teamname
 */
var getTeamByName = function(teamName, cb){
	myTeam.findOne(
		{ teamName:teamName}
		, null
		, cb)
}

/** 
 * getTeamById
 *
 * @params {id} callback
 *
 * finds a single team by id
 */
var getTeamById = function(id, cb){
	myTeam.findOne(
		{_id:id}
		, null
		,cb)
}

/** 
 * getTeams
 *
 * gets all the teams
 */
var getTeams = function(cb){
	myTeam.find(
		null
		, null
		, cb)
}


module.exports = mongoose.model('team', Team);
module.exports.makeTeam = makeTeam;
module.exports.queryTeamName = queryTeamName;
module.exports.addUser = addUser;
module.exports.makeTeam = makeTeam;
module.exports.addSurvey = addSurvey;
module.exports.getTeamsByUser = getTeamsByUser;
module.exports.getTeamByName = getTeamByName;
module.exports.getTeamById = getTeamById;
module.exports.getTeams = getTeams;