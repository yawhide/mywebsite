var dbURI    = 'mongodb://localhost/surveyAppTest'
, should   = require('chai').should()
, mongoose = require('mongoose')
, team = require('./../models/team')
, clearDB  = require('mocha-mongoose')(dbURI)
;

describe("Example spec for a model", function() {
	beforeEach(function(done) {
		if (mongoose.connection.db) return done();

		mongoose.connect(dbURI, done);
	});

	it("can be saved", function(done) {
		team.makeTeam('j', 'jTeam', function (err, model){
			if (err) return done(err);
			done()
		})
	});

	it("can be found", function (done){
		team.makeTeam('j', 'jTeam', function (err, model){
			if (err) return done(err);
			team.queryTeamName('jTeam', function (err, coll){
				if(err) return done(err);

				coll.length.should.equal(1)
				done()
			})
		})
	})

	it('can be addedU', function (done){
		team.makeTeam('j', 'jTeam', function (err, model){
			if (err) return done(err);
			team.addUser('jTeam', 'calvinH', function (err, cb){
				cb.teamUsers.length.should.equal(2)
				done()
			})
		})
	})

	it('can be addedS', function (done){
		team.makeTeam('j', 'jTeam', function (err, model){
			if (err) return done(err);
			var ob = {}
			ob._id = '897as89d7f89df7'
			team.addSurvey(ob, 'jTeam', function (err, cb){
				cb.survey.length.should.equal(1)
				done()
			})
		})
	})

	it('can be found2', function (done){
		team.makeTeam('j', 'jTeam', function (err, model){
			if (err) return done(err);
			team.makeTeam('j', 'sTeam', function (err, model){
				if (err) return done(err);
				team.addUser('jTeam', 'calvinH', function (err, cb){
					if (err) return done(err);
					team.addUser('sTeam', 'calvinH', function (err, cb){
						if (err) return done(err);
						team.getTeamsByUser('calvinH', function (err, cb){
							cb.length.should.equal(2)
							done()
						})
					})
				})
			})
		})
	})

});