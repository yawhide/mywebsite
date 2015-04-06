var passport = require('passport')
	,Account = require('./models/account')
	,Survey = require('./models/survey')
	,Team = require('./models/team')
	,Reset = require('./models/reset')
	,check = require('validator').check
	,sanitize = require('validator').sanitize
	, nodemailer = require('nodemailer');


module.exports = function (app) {
	app.get('/teams', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) { return res.redirect('/surveyapp/'); }
			Team.getTeamsByUser(req.user.username, function (err, coll){
				if(err) res.send(500, 'could not find any teams')
				else{
					res.render('teams', { user : req.user, collection: null, yourTeams: coll, message: null});//yourTeam.team });
				}
			})
		})(req, res, next);
	});

	/**
	 * /teams/:id
	 *
	 * @params {URL}
	 *
	 * does a get request and loads the team page with the team
	 *	from the :id
	 */
	app.get('/teams/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) { return res.redirect('/surveyapp/'); }
			Team.getTeamById(req.params.id, function (err, team){
				if(err) res.send(500, 'Could not get team by id')
				else{
					Survey.getAllSurveys(function (err, coll){
						if(err) res.send(500, 'could not lookup all surveys')
						else{

							var j = 0;
							var arr = [];
							for(; j < team.survey.length; j++){
								var i = 0;
								for(; i < coll.length; i++){
									if(coll[i]._id == team.survey[j])
										arr.push(coll[i]);
								}
							}
							res.render('team', {user:req.user, team:team, message: null, surveys:arr});
						}
					})
				}
			})
		})(req, res, next);
	});


	/**
	* Creates the team by teamName using makeTeam() function.
	*
	*/
	app.post('/teams', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyapp/');
			Team.getTeamsByUser(req.user.username, function (err, coll){
				if(err) res.send(500, 'could not find any teams')
				else{
					Team.queryTeamName(req.body.teamName, function (err2, success){
						if(err2) res.send(500, 'could not query names')
						else if(success.length > 0){
							res.render('teams', { user : req.user, collection: null, yourTeams: coll, message: 'That team name is taken'});
						}
						else{
							Team.makeTeam(req.user.username, req.body.teamName, function (err3, team){
								res.redirect('/surveyapp/teams')
							});
						}
					})
				}
			})
		})(req, res, next);
	});

	app.post('/teamQuery/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyapp/');

			if(req.body.Search){
				Account.getAccountByUser(req.body.userQuery, function (err, user){
					if(!user){
						Account.getAccByEmail(req.body.userQuery, function (err3, email){
							if(!email){
								Team.getTeamById(req.params.id, function (err2, team){
									if(err2) res.send(500, 'Could not get team by id')
									else{
										Survey.getAllSurveys(function (err, coll){
											if(err) res.send(500, 'could not lookup all surveys')
											else{

												var j = 0;
												var arr = [];
												for(; j < team.survey.length; j++){
													var i = 0;
													for(; i < coll.length; i++){
														if(coll[i]._id == team.survey[j])
															arr.push(coll[i]);
													}
												}
												res.render('team', {user:req.user, team:team, message: 'That username or email does not exist', surveys:arr});
											}
										})
									}
								})
							}
							else{
								Team.addUser(req.body.Search, email.username, function (err4, user){
									if(err4) res.send(500,'could not set the team array in account');
									else{
										res.redirect('/surveyapp/teams/'+req.params.id);
									}
								})
							}
						})
					}
					else{
						Team.addUser(req.body.Search, req.body.userQuery, function (err5, user){
							if(err5) res.send(500,'could not set the team array in account');
							else{
								res.redirect('/surveyapp/teams/'+req.params.id);
							}
						})
					}
				})
			}
		})(req, res, next);
	});
}
