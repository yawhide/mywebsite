var passport = require('passport')
	, Account = require('./models/account')
	, Survey = require('./models/survey')
	, Team = require('./models/team')
	, Reset = require('./models/reset')
	, check = require('validator').check
	, sanitize = require('validator').sanitize
	, nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
        //service: 'Gmail', // use well known service.
                            // If you are using @gmail.com address, then you don't
                            // even have to define the service name
        auth: {
            user: "rshashtable@gmail.com",
            pass: "lascannon"
        }
    });

console.log('SMTP Configured');

// Message object
var makeFunction = function(user, id)
{
	var message;
	return  message = {

		// sender info
		from: 'surveyhide <aliandfila1@gmail.com>',

		// Comma separated list of recipients
		to: user,

		// Subject of the message
		subject: 'surveyhide - Change Password', //

		// plaintext body
		text: 'Please follow this link to reset your password yawhide.com/surveyhide/reset/'+id,

		// HTML body
		html:'<p>Please follow this link to reset your password yawhide.com/surveyhide/reset/' + id + '</p>'
	};
}

module.exports = function (app) {
	app.get('/', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) {
				return res.render('login', {user : req.user, message: req.flash('error').length > 0 ? true:false });
			}
			Survey.getRecentSurvey(req.user.username, function (err, activeSurveys){
				if(err){res.send(500, 'could not get the newest surveys');}
				else{
					Survey.getNewSurveys(function  (err2, newSurveys){
						if(err2){res.send(500, 'failed to get the new surveys');}
						else{
							Team.getTeamsByUser(req.user.username, function (err3, yourTeam){
								if(err3){res.send(500, 'failed to get your team list');}
								else{
									/* this method below sorts by order of alphabet
									var team = yourTeam[0].team.teamName.sort(function (a, b) {
										return a.toLowerCase().localeCompare(b.toLowerCase());
									});*/
									Survey.getAllSurveys(function (err4, coll){
										if(err4){res.send(500, 'failed to get all surveys')}
										else{
											var arr = [];
											yourTeam.forEach(function (t){
												var ob = {};
												ob.teamName = t.teamName;
												ob.teamOwner = t.teamOwner;
												ob.surveys = [];
												ob._id = t._id;
												coll.forEach(function (c){
													if(!c.deleteFlag && c.teamName === t.teamName)
														ob.surveys.push(c);
												})
												arr.push(ob);
											})
											res.render('index', { user : req.user, activeSurveys: activeSurveys.slice(0,4), newSurveys: newSurveys.slice(0,4), yourTeamSurvey: arr, teamSurvey : arr});
										}
									});


								}
							});
						}
					});
				}
			});
		})(req, res, next);
	});

	/**
	 * app.post('/')
	 *
	 * @params '/'
	 *
	 * this method is called when the user clicks login. If the authentication fails,
	 *	the user is redirected to the login page ('/') AND a failureFlash is displayed
	 *	prompting the user what they did wrong.
	 *	If authentication succeeds, a cookie is made with an expiry of 24 hours or 1 month
	 *	depending on whether they ticked 'remember me' or not.
	 */
	app.post('/', passport.authenticate('local', { failureRedirect: '/surveyhide/', failureFlash: true}), function (req, res) {
		var CurrentDate = new Date();
		/* if you did check remember me, we set the cookie expiry to 30 days later
			from today's date.
			if you didn't check remember me, we set the cookie expiry to 24 hours later */
		if(typeof req.body.rememberMe != 'undefined'){
				var thirtyDays = 30*24*60*60*1000;
				req.session.cookie.expires = new Date(Date.now() + thirtyDays);
				req.session.cookie.maxAge = thirtyDays;
			}
			else{
				var thirtyDays = 24*60*60*1000;
				req.session.cookie.expires = new Date(Date.now() + thirtyDays);
				req.session.cookie.maxAge = thirtyDays;
			}
			res.redirect('/surveyhide/');
		});

	app.post('/index', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			if (req.body.queryName == "" && req.body.surveyID != "" )
			{
				Survey.getSurveybyID(req.body.surveyID, function (err, collection){
					if(err){
						console.log("ERRORRRR!!!! on getting ID on index page");
						res.render('index', { user : req.user, collection: "None"});
					}
					else{
						console.log("Collection is gotten");
						res.render('index', { user : req.user, collection: collection});
					}
				});
			}
			if (req.body.queryName != "" && req.body.surveyID == "" )
			{
				Survey.querySurveyTitle(req.body.queryName, function (err, collection){
					if(err){
						console.log("ERRORRRR!!!! on getting survey title in index");
						res.render('index', { user : req.user, collection: "None"});
					}
					else{
						console.log("Collection is gotten");
						res.render('index', { user : req.user, collection: collection});
					}
				});
			}
		})(req, res, next);
	});

	app.get('/forgot', function(req, res) {
		res.render('forgot');
	});

	app.post('/forgot', function(req, res) {
		Account.getAccByEmail(req.body.email, function(err, result) {
			if (err) {
				console.log('Err');
				res.render('forgot');
			}
			else if (result == null) {
				res.render('forgot', { result : 'Account does not exist, please try again'});
			}
			else {
				var tempID = result._id;
				Reset.createReset(tempID, function(err, result1) {
					if (err) {}
					else {
						console.log('Sending Mail');
						message = makeFunction(req.body.email,result1._id);
						transport.sendMail(message, function (error){
							if(error){
								console.log('Error occured');
								console.log(error.message);
								transport.close();
								return;
							}
							console.log('Message sent successfully!');
							transport.close(); // close the connection pool
						});
						res.render('forgot', { result : 'Email has been sent!'});
					}
				});
			}
		});
	});

	app.get('/reset/:id', function(req, res) {
		var id;
		console.log('id is' + req.params.id);
		res.render('reset', {id: req.params.id});
	});

	app.post('/reset/:id', function(req, res) {
		var success;
		Reset.queryResetsByID(req.params.id, function(err, reset) {
			if (err) {
				console.log('Could not find');
				res.render('forgot', {success : 'Failed to get User' });
			}
			else {
				Account.accountByID(reset.userID, function(err, result)
				{
					if (err) { res.render('forgot', {success : 'Failed to get User' });}
					else {
						result.setPassword( req.body.password , function(err, self) {
							if (err) { }
							else { console.log('Pass set');
						}
						self.save(function(err) {
							if (err) {
								res.render('forgot', {success : 'Failed to save pass' });
							}
							else { res.render('forgot', {success : 'Successfully updated your password!' });
						}
					});
					});
					}
				});
			}
		});
		res.render('reset', {success: 'Successfully updated your password!' });
	});

	app.get('/register', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (req.user) { return res.redirect('/surveyhide/'); }
			else
				res.render('register', {username: '', email:'', password:''});
		})(req, res, next);
	});

	app.post('/register', function (req, res) {
		Account.findAllUsernames(function (err, coll){
			/* This method is to check to see if the email is already taken */
			if(err){
				res.send(500, 'failed to get collection in register');
			}
			else{
				var errorEmail = false
				, errorUser = false;
				/* we loop through all the account objects and check if the email fom the req.body
					is the same as ANY of the emails in any of the account objects from coll */
				for(var i = 0; i < coll.length; i++){
					if(coll[i].email === req.body.email){
						errorEmail = true;
					}
					if(coll[i].username.toLowerCase() === req.body.username.toLowerCase()){
						errorUser = true;
					}
				}
				if(errorEmail && errorUser){
					res.render('register', { errorMsg:'Username and Email already taken', username: '', email:'', password : req.body.password});
				}
				else if (errorEmail){
					res.render('register', { errorMsg:'Email already taken', username: req.body.username, email:'', password : req.body.password});
				}
				else if(errorUser){
					res.render('register', { errorMsg:'Username already taken', username:'', email: req.body.email, password : req.body.password});
				}
				else{
					Account.register(new Account({ username : req.body.username }), req.body.password, function (err, account) {
						if (err) {
							res.send(500, 'unable to create an account');
						}
						else{
							Account.setEmail(account._id, req.body.email, function (err){
								if(err){
									res.send(500, 'failed to set email');
								}
								else{
									res.redirect('/surveyhide/');
								}
							});
						}
					});
				}
			}
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/surveyhide/');
	});

	app.get('/home', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			res.render('home', { user : req.user });
		})(req, res, next);
	});

	app.post('/home', passport.authenticate('local'), function (req, res) {
		res.redirect('/surveyhide/');
	});

	app.get('/user/:id', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			var success;
			Account.getAccountByUser(req.params.id, function(err, result) {
				if (err) {
					res.render('public_profile', {success : 'fail'});
				} else {
					var publicData = {
						username : result.username,
						firstName : result.firstName,
						lastName: result.lastName,
						email: result.email,
						phoneNumber: result.phoneNumber
					};
					res.render('public_profile', {user : req.user, success : 'success', result : publicData });
				}
			});
		})(req, res, next);
	});

	app.get('/change-password', function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			res.render('change-password', { user : req.user, message: null });
		})(req, res, next);
	});


	/**
 	 * change-password
 	 *
 	 * @params {String} (route), Callback
 	 *
 	 * Get the user's current password and new password from the req.body
 	 * 	Get accountByuser (takes username, callback is the user object)
 	 *  call authenticate (passport.js method) to get the user-object (this means password is correct aka success)
 	 *  call setPassword (passport.js method) to overwrite the current user's password
 	 *  save that user object to db

	 */
	app.post('/change-password', function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			var cpass = req.body.currentPassword;
			var pass = req.body.password1;
			var pass2 = req.body.password2;


			Account.getAccountByUser(req.user.username, function (err, user){
				if(err){res.send(500, 'could not lookup username');}
				else{
					user.authenticate(cpass, function (err2, cb){
						if(err2){ return res.render('change-password', { user: req.user, message: 0 })}
						else{
							cb.setPassword( req.body.password , function (err3, self) {
								if (err3) { res.send(500, 'could not set the new password')}
								self.save(function (err4) {
									if (err4) {res.send(500, 'could not save the password to db')}
									else {
										res.render('change-password', { user: req.user, message: 1 });
									}
								});
							});
						}
					})
				}
			})
		})(req, res, next);
	});

	app.post('/search', function (req, res, next){
		passport.authenticate('local', function (err, user, info) {
			if (err) { return next(err); }
			else if (!req.user) { return res.redirect('/surveyhide/'); }
			Survey.querySurveyTitle(req.body.queryName, function (err, surveys){
				if(err){res.send(500, 'could not lookup query');}
				else if(typeof surveys !== 'undefined' && surveys.length <= 0){
					Survey.getSurveybyID(req.body.queryName, function (err2, survey){
						if(err2){res.render('search', {list:[], user:req.user, searchResults: true});}
						else{
							var arr = [];
							arr.push(survey);
							res.render('search', {list:arr, user:req.user});
						}
					})
				}
				else{
					res.render('search', {list:surveys, user: req.user})
				}
			})
		})(req, res, next);
	});
}
