module.exports = function(grunt){

	"use strict";

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json')

		, watch: {
			js: {
				files: ['public/js/bootstrap.js'
				, 'public/js/functions.js'
				, 'public/js/darren.js'
				, 'public/js/stefan.js'
				, 'public/js/registration.js'
				, 'public/js/validetta.js'
				, 'public/js/clickDetect.js'
				, 'public/js/jpanelmenu.js'
				, 'public/js/hammer.js']
				, tasks: ['concat', 'uglify']
			}
		}

		, concat: {
			options: {
				separator: ';'
			}
			, dist: {
				src: ['public/js/*.js']
				, dest: 'public/js/concat.js'
			}
		}

		, uglify: {
			build: {
				files: {
					'public/js/concat.min.js': ['public/js/concat.js']
				}
			}
		}
	});

	grunt.registerTask('default', []);

};