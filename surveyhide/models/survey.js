var mongoose = require('mongoose'),
Schema = mongoose.Schema,
passportLocalMongoose = require('passport-local-mongoose');

var SurveySchema = new Schema({
	surveyName: String
	, surveyOwner: String
	, viewCount: Number
	, startCount: Number
	, completedCount: Number
	, comment: String
	, date: { type: Date, default: Date.now }
	, lastModBy: String
	, lastMod: { type: Date, default: Date.now }
	, questions: []
	, answers: []
	, teamName: String
	, deleteFlag: {type: Boolean, default:false}
});



var MySurvey = mongoose.model('survey', SurveySchema);

/** 
 * getSurveyTitles
 *
 * @param {string} - owner, surveyOwner
 * @param {callback}
 *
 * returns all the surveys that are made by the parameter 'owner'
 */
var getSurveyTitles = function(owner, callback){
	MySurvey.find(
		{surveyOwner: owner},
		null,
		{},
		function (err, collection){
			if(err != null){
				callback(err, null);
				
			}
			else{
				
				callback(null, collection);
			}
		}
		);
};

/** 
 * getSurveybyID
 *
 * @param {string} - surveyID, surveyID
 * @param {callback}
 *
 * returns all the surveys that match surveyID param
 */
var getSurveybyID = function(surveyID, callback){
	MySurvey.findOne(
		{_id: surveyID},
		null,
		{},
		function (err, collection){
			if(err){
				callback(err, null);
			}
			else{
				
				callback(null, collection);
			}
		}
		);
};

/** 
 * getSurvey
 *
 * @param {string} - title, SurveyName
 * @param {callback}
 *
 * returns all the surveys that match the 'title' param
 */
var getSurvey = function(title, callback){
	MySurvey.find(
		{surveyName : title},
		null,
		{
			sort:{
				surveyName: 1
			}
		},
		function (err, collection){
			if(err != null){
				callback(err, null);
				
			}
			else{
				
				callback(null, collection);
			}
		}
		);
};

/**
 * editSurvey
 *
 * @param {string} - title, surveyName
 * @param {string} - owner, surveyOwner
 * @param {[]} - question, question array
 * @param {string} - teamName, teamName
 * @param {string} - comment, comment
 * @param {callback} - callback
 *
 * creates a surveys and saves it in the database. All the params are needed
 *	for the survey schema
 */
var makeSurvey = function(title, owner, question, comment, teamName, callback){
	var instance = new MySurvey();
	instance.surveyName = title;
	instance.surveyOwner = owner;
	instance.questions = question;
	instance.teamName = teamName;
	instance.answers = new Array();
	instance.viewCount = 0;
	instance.startCount = 0;
	instance.completedCount = 0;
	instance.lastModBy = owner;
	instance.comment = comment;

	instance.save(function (err, instance){
		callback(err, instance);
	});
}

/** 
 * querySurveyTitle
 *
 * @param {string} - title, SurveyName
 *
 * Querying through Survey table.
 *  Searching for title containing the words 
 *  To get the survey by ID, use get Survey by ID function
 */
var querySurveyTitle = function(title, callback){
	MySurvey.find(
		{surveyName : new RegExp(title, 'i')},
		null,
		{
			sort:{
				surveyName: 1
			}
		},
		function (err, collection){
			if(err != null){
				callback(err, null);
				
			}
			else{
				callback(null, collection);
			}
		}
		);
};

/**
 * updateAnswer
 *
 * @param {Object} - survey, surveyObject
 * @param {callback} - callback
 *
 * updates the survey's completed count by increasing it by one.
 *	Because we already have the id from the param 'survey', it makes
 *	a put request automatically
 */
var updateAnswer = function(survey, callback){
	survey.completedCount++;
	survey.save(function (err){
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, survey);
		}
	});
}

/**
 * incStartCount
 *
 * @param {Object} - survey, surveyObject
 * @param {callback} - callback
 *
 * updates the survey's start count by increasing it by one.
 *  Because we already have the id from the param 'survey', it makes
 *	a put request automatically
 */
var incStartCount = function(survey, callback){
	/* updates the survey's start count by increasing it by one.
		Because we already have the id from the param 'survey', it makes
		a put request automatically*/
	survey.startCount++;
	survey.save(function (err){
		callback(err);
	});
}

/**
 * incViewCount
 *
 * @param {string} - surveyID, surveyID
 * @param {callback} - callback
 *
 * updates the survey's view count by increasing it by one.
 *	Because we already have the id from the param 'survey', it makes
 * 	a put request automatically
 */
var incViewCount = function(id, callback){
	MySurvey.findByIdAndUpdate(
		id
		,{$inc:{viewCount:1}}
		,callback)
}

/**
 * editSurvey
 *
 * @param {string} - user, surveyID
 * @param {string} - title, surveyName
 * @param {string} - owner, surveyOwner
 * @param {[]} - question, question array
 * @param {string} - dropbox, teamName
 * @param {string} - comment, comment
 * @param {callback} - callback
 *
 * gets all the surveys made and sorts it by last modified date
 */
var editSurvey = function(id, title, owner, question, comment, dropbox, callback){
	/* updates a survey according to the param 'id' by replacing its contents with
		the rest of the params*/
	var dateNow = new Date().getTime();
	MySurvey.findById(
		id,
		function (err, cb){
			if(err){
				cb(err, null);
			}
			else{
				cb.lastModBy = owner;
				if(title != '')
					cb.surveyName = title;
				cb.questions = question;
				cb.lastMod = dateNow;
				cb.comment = comment;
				cb.teamName = dropbox;
				cb.viewCount = 0;
				cb.startCount = 0;
				cb.completedCount = 0;
				cb.answers = [];
				cb.save(function (err, coll){
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, coll);
					}
				});
			}
		}
		);
}

var desc = function(loc1, loc2) {
	/** this is the logic the sort function below will use,
		sorts according to lastModification time. Last mod comes first*/
	return loc2.lastMod.getTime() - loc1.lastMod.getTime();
}

/**
 * getRecentSurvey
 *
 * @param {string} - survyeOwner
 * @param {callback} - callback
 *
 * gets all the surveys made and sorts it by last modified date
 */
var getRecentSurvey = function(user, cb){
	MySurvey.find(
		{surveyOwner: user},
		null,
		{
			limit: 5,
			sort: {
				lastMod: -1
			}
		},
		function (err, coll){
			cb(err, coll);
		}
		);
}

/**
 * getNewSurveys
 *
 * @param {callback} - callback
 *
 * gets all the surveys and returns the newest 5 (sorted by date)
 */
var getNewSurveys = function (cb){
	/* returns the top 5 newest surveys created!*/
	MySurvey.find(
		null,
		null,
		{
			limit: 5,
			sort: {
				date: -1
			}
		},
		function (err, coll){
			cb(err, coll);
		}
		);
}
/**
 * getAllSurveys
 *
 * @param {callback} - callback
 *
 * returns all the surveys
 */
var getAllSurveys = function (cb){
	/* returns all the surveys*/
	MySurvey.find(
		null,
		null,
		function (err, coll){
			cb(err, coll);
		});
}
/**
 * deleteSurvey
 *
 * @param {string} - id, surveyID
 * @param {callback} - callback
 *
 * finds the survey corresponding to the ID and updates its
 *	deleted flag to true
 */
var deleteSurvey = function (id, cb){
	MySurvey.findByIdAndUpdate(
		id
		, {deleteFlag:true}
		,cb)
}

module.exports = mongoose.model('survey', SurveySchema);
module.exports.getSurveyTitles = getSurveyTitles;
module.exports.getSurvey = getSurvey;
module.exports.makeSurvey = makeSurvey;
module.exports.getSurveybyID = getSurveybyID;
module.exports.querySurveyTitle = querySurveyTitle;
module.exports.updateAnswer = updateAnswer;
module.exports.incStartCount = incStartCount;
module.exports.incViewCount = incViewCount;
module.exports.editSurvey = editSurvey;
module.exports.getRecentSurvey = getRecentSurvey;
module.exports.getNewSurveys = getNewSurveys;
module.exports.getAllSurveys = getAllSurveys;
module.exports.deleteSurvey = deleteSurvey;
