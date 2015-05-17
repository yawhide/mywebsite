var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Answers = new Schema({
	surveyName: String
	,surveyOwner: String
	,viewCount: Number
	,startCount: Number
	,completedCount: Number
	,comment: String
	,date: Date
	,lastModBy: String
	,lastMod: Date
	,questions: []
	,answers: []
	,backupDate: {type:Date, default:Date.now}
	,teamName: String
});

Answers.plugin(passportLocalMongoose);
ans = mongoose.model('Answers', Answers);

/** 
 * makeBackup
 *
 * @param {Object} - survey, a survey object
 * @param {cb}
 *
 * makes an Answers Object by taking the info from survey 
 *	and copying it. 
 */
var makeBackup = function (survey, cb){
	var ins = new ans();
	ins.surveyName = survey.surveyName;
	ins.surveyOwner = survey.surveyOwner;
	ins.viewCount = survey.viewCount;
	ins.startCount = survey.startCount;
	ins.completedCount = survey.completedCount;
	ins.comment = survey.comment;
	ins.date = survey.date;
	ins.lastModBy = survey.lastModBy;
	ins.lastMod = survey.lastMod;
	ins.questions = survey.questions;
	ins.answers = survey.answers;
	ins.teamName = survey.teamName;
	ins.save(function (err){
		cb(err);
	}
		);
}

/** 
 * findAllBackup
 *
 * @param {cb}
 *
 * returns all the Answers Objects
 */
var findAllBackup = function (cb){
	ans.find(null,null, function (err, coll){
		cb(err, coll);
	})
}

module.exports = mongoose.model('Answers', Answers);
module.exports.makeBackup = makeBackup;
module.exports.findAllBackup = findAllBackup;