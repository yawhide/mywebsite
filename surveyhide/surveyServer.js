var passport = require('passport')
	,Account = require('./models/account')
	,Survey = require('./models/survey')
	,Team = require('./models/team')
	,Result = require('./models/results')
	,Reset = require('./models/reset')
	,check = require('validator').check
	,sanitize = require('validator').sanitize
	, nodemailer = require('nodemailer');

module.exports = function (app) {
	app.get('/my-surveys', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');

			Survey.getSurveyTitles(req.user.username,function (err, collection){
				if(err){
					console.log("ERRORRRR!!!!");
					res.send(404, "unable to get survey titles");
				}
				else{
					console.log("Collection is gotten");
					res.render('my-surveys', { user : req.user, collection: collection});
				}
			});

		})(req, res, next);
	});

	app.post('/my-surveys', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			res.redirect('/surveyhide/');
		})(req, res, next);
	});

	app.get('/new-survey', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			Team.getTeamsByUser(req.user.username, function (err, coll){
				if(err) res.send(500, 'could not get all teams')
				else{
					res.render('new-survey', { user : req.user, yourTeams:coll, collection: null });
				}
			})
		})(req, res, next);
	});

	app.get('/new-survey/:id', function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			Survey.getSurveybyID(req.params.id, function (err, survey){
				if(err) res.send(404, "unable to get surveys by ID");
				else{
					Team.getTeamsByUser(req.user.username, function (err, coll){
						if(err) res.send(500, 'could not get all teams')
						else{
							res.render('new-survey', { user : req.user, collection: survey, id: req.params.id, yourTeams:coll});
						}
					});
				}
			});
		})(req, res, next);
	});

	/*
	* Creates a temporary question object.
	* Question Name : request.body.questionName
	* Question Answer Type: request.body.answerValue[0]
	*/

	app.post('/new-survey', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			var name = req.body.surveyName;
			var quest = req.body.questionArray;
			var comment = '';//req.body.comment;
			Survey.makeSurvey(name, req.user.username, quest, comment, req.body.team, function (err, coll){
				if (err) {
					console.log("ERROR saving survey, sorry....");
					res.send(404);
				}
				else{
					Team.addSurvey(coll, req.body.team, function (err3, team){
						if(err3) res.send(500, 'failed to updates team surveys')
						else{
							res.send(200, 'success');
						}
					})
				}
			});
		})(req, res, next);
	});

	app.post('/new-survey/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');

			Survey.getSurveybyID(req.params.id, function (err, cb){
				if(err) res.send(500, 'failed to get survey by its ID to make a backup')
				else{
					Result.makeBackup(cb, function (err2){
						if(err2) res.send(500, 'failed to make backup')
						else{
							Survey.editSurvey(req.params.id, req.body.surveyName, req.user.username, req.body.questionArray, '', cb.teamName, function (err3, coll){
								if(err3){
									console.log("ERROR editting survey, sorry....");
									res.send(404);
								}
								else{
									res.send(200, 'success');
								}
							});
						}
					})
				}
			});
		})(req, res, next);
	});

	app.get('/survey/:id', function (req, res) {
		req.logout();
		Survey.getSurveybyID(req.params.id, function (err, collection){
			if(err){
				res.send(404, "unable to get survey titles");
			}
			else{
				Survey.incViewCount(req.params.id, function (err){
					if(err){
						console.log('~~~~~~Failed to increase the view count!!!!!');
						res.send(500);
					}
					else{
						console.log('incremented the view count');
						console.log(collection);
						res.render('survey', { collection: collection, id: req.params.id, survey:true, doneSurvey:false});
					}
				})
			}
		});
	});

	app.post('/editSurvey', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			/**
			 * when you select a survey in the existing tab, you can select 3 buttons and this
				method basically sends you to the correct page (corresponds to the button) and
				attaches the survey id along with it.
			 */
			console.log(req.body);
			if(typeof req.body.radio == 'undefined'){
				res.redirect('/surveyhide/my-surveys');
			}
			else if(req.body.start){
				res.redirect('/surveyhide/survey/' + req.body.radio);
			}
			else if(req.body.edit){
				res.redirect('/surveyhide/new-survey/' + req.body.radio);
			}
			else if(req.body.stat){
				res.redirect('/surveyhide/stats/' + req.body.radio);
			}
			else if(req.body.preview){
				res.redirect('/surveyhide/preview/' + req.body.radio);
			}
			else if(req.body.deleteFlag){
				res.redirect('/surveyhide/delete/' + req.body.radio);
			}
		})(req, res, next);
	});

	app.post('/submitSurvey/:id', function (req, res) {
			/**
			* this is a post method that is run when the user submits their completed survey
			* it finds the survey that has the correct id provided in the URL and adds an
			array of the answers that the user chose in the survey.
			*/
			Survey.getSurveybyID(req.params.id, function (err, s) {
				if (!s)
					return next(new Error('Could not load Document'));
				else {
					console.log(req.body);
					s.answers.push(req.body);
					Survey.updateAnswer(s, function (err) {
						if (err){
							console.log('error submitting survey');
							console.error(err);
						}
						else{
							Survey.getSurveybyID(req.params.id, function (err, collection){
								if(err){
									res.send(404, "unable to get survey titles");
								}
								else{
									res.render('survey', { user : req.user, collection: collection, id: req.params.id, survey:true, doneSurvey:true});
								}
							});
						}
					});
				}
			});
	});

	app.post('/incStartCount/:id', function (req, res) {
		Survey.getSurveybyID(req.params.id, function (err, s) {
			if (!s)
				return next(new Error('Could not load Document'));
			else {
				Survey.incStartCount(s, function (err) {
					if (err){
						console.log('______________________');
						console.log('error increasing start count');
						console.log('______________________');
					}
					else{
						console.log('______________________');
						console.log('successfully increased start count');
						console.log('______________________');
					}
				});
			}
		});
	});

	app.get('/preview/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');

			Survey.getSurveybyID(req.params.id, function (err, collection){
				if(err){
					res.send(404, "unable to get survey titles");
				}
				else{
					res.render('survey', { user : req.user, collection: collection, id: req.params.id, survey:false});
				}
			});
		})(req, res, next);
	});

	app.get('/delete/:id', function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyhide/');
			Survey.deleteSurvey(req.params.id, function (err, coll){
				console.log('\n' + err + " " + coll + '\n');
				if(err) res.send(500, 'could not delete that survey')
				else{
					res.redirect('/surveyhide/');
				}
			})
		})(req, res, next);
	})

	app.post('/preview', function (req, res){
		res.render('preview', {collection: req.body})
	})
}
