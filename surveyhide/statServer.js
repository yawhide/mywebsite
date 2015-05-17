var passport = require('passport')
	,Account = require('./models/account')
	,Survey = require('./models/survey')
	,Team = require('./models/team')
	,Reset = require('./models/reset')
	,check = require('validator').check
	,sanitize = require('validator').sanitize
	, nodemailer = require('nodemailer');

function is_array(o) {
        if(o != null && typeof o == 'object') {
                return (typeof o.push == 'undefined') ? false : true;
        }else {
                return false;
        }
}

module.exports = function (app) {
	app.get('/stats/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');

			surveyID = req.params.id;
			Survey.getSurveybyID(req.params.id, function (err, collection){
				if(err) res.send(500, "unable to get survey titles");
				else{
					var q = collection.questions
					, a = collection.answers;
					var qLen = collection.questions.length
					, aLen = collection.answers.length;
					var i = 0;
					var arr = [];
					var longestAns = 0;
					for(; i < qLen; i++){
						var qOb = {};
						/** checking if the question type is supported */
						if(q[i].type == 'checkbox' || q[i].type == 'radio' || q[i].type == 'droplist'){
							qOb.name = q[i].questionName;
							qOb.number = aLen;
							qOb.choice = {};
							var j = 0
							, k = 0;
							for(; j < q[i].answerArray.length;j++){
								/** this makes an object where each key is a possible answer to a question */
								qOb.choice[q[i].answerArray[j]] = 0;
								if(q[i].answerArray.length > longestAns)
									longestAns = q[i].answerArray.length;
							}
							/** So i basically need to store the number of times a certain answer was answered along with the actual answer, so I decided to use the answer as the key and the number of times that answer was answered as the value */
							for(; k < aLen; k++){
								/** loop through answers */
								for(var l in a[k]){
									/** loop through each key value pair */
									if(l == qOb.name){
										/** check if the question names are the same */
										if(is_array(a[k][l])){
											for(var m in a[k][l]){
												/** here I just increment the answer amount by one. I dont even need to check if the answer names match because I made the actual key in the key value pair the answer name. So the properties of dictionaries check for me if the variable is a key. */
												qOb.choice[a[k][l][m]] += 1;
											}
										}
										else{
											qOb.choice[a[k][l]] += 1;
										}
									}
								}
							}
						}
						arr.push(qOb);
					}
					res.render('stats', { user: req.user, info : arr, completedCount : collection.completedCount, startCount : collection.startCount, viewCount : collection.viewCount, surveyID : collection._id, surveyName : collection.surveyName, longestAns:longestAns });
				}
			});
		})(req, res, next);
	});

	app.post('/exportData', function (req, res){
		/**
		* this is a post method that is run when the user submits their completed survey
		* it finds the survey that has the correct id provided in the URL and adds an
		array of the answers that the user chose in the survey.
		*/
		res.writeHeader(200,{"Content-type":"application/csv","Content-Disposition":"attachment;filename='export.csv'"});
		Survey.getSurveybyID(req.body.Data, function (err, collection) {
			if (!collection)
				return next(new Error('Could not load Document'));
			else {
				var i=0;
				res.write("Title:" + "," + collection.surveyName);
				res.write("\n");
				res.write("Completed Surveys: "+ collection.completedCount + "\n" + "Started Surveys: " + collection.startCount + "\n" + "ViewedSurveys: " +collection.viewCount)
				res.write("\n"+"\n");
				res.write("ID" + "," + "Question"+ "," + "Answer");
				res.write("\n");
				for(var k=0 ; k<collection.answers.length;k++){
					var obj=collection.answers[k];
					i++;
					var x=0;
					for(var property in obj){
						res.write(i +"," +property+ "," + obj[property]);
						res.write("\n");

					}
				}
				res.write("\n");
				res.end();
			}
		});
	});

}
