var passport = require('passport')
	,Account = require('./models/account')
	,Survey = require('./models/survey')
	,Team = require('./models/team')
	,Reset = require('./models/reset')
	,check = require('validator').check
	,sanitize = require('validator').sanitize
	, nodemailer = require('nodemailer');
module.exports = function (app) {
app.get('/profile', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyapp/');

			res.render('profile', {
				username : (req.user.username == null ? '' : req.user.username),
				email : (req.user.email == null ? '' : req.user.email),
				firstName : (req.user.firstName == null ? '' : req.user.firstName),
				lastName : (req.user.lastName == null ? '' : req.user.lastName),
				phoneNumber : (req.user.phoneNumber == null ? '' : req.user.phoneNumber),
				user : req.user
			});

		})(req, res, next);
	});

	app.post('/saveProfile', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			else if (!req.user) return res.redirect('/surveyapp/');
			//req.user.id
			console.log('********************************************');

			Account.setAccountInfo(req.user.id, req.body.firstName, req.body.lastName,
				req.body.email, req.body.phoneNumber, function (err){
					if(err){
						console.log("FAILED TO UPDATE PROFILE!!!");
					}
					else{
						res.redirect('/surveyapp/profile');
					}
			});
		})(req, res, next);
	});



}
