var survey = require('../../models/survey');

var existing_survey_query = function (user) {
var surveyList = survey.find({surveyOwner: user}, function (err,docs){
	});
}