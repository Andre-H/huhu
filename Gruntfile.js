module.exports = function (grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		jshint : {
			files : ['Gruntfile.js'],
			options : {
				// options here to override JSHint defaults
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}

		},
		protractor : {
			options : {
				keepAlive : true,
				configFile : "tests/e2e/conf.js"
			},
			singlerun : {},
			auto : {
				keepAlive : true,
				options : {
					args : {
						seleniumPort : 4444
					}
				}
			}
		},
		shell : {
			options : {
				stdout : true
			},
			protractor_install : {
				command : 'node ./node_modules/protractor/bin/webdriver-manager update'
			},
			npm_install : {
				command : 'npm install'
			}
		}

	});

	grunt.loadNpmTasks('grunt-shell-spawn');

	grunt.registerTask('install', ['shell:npm_install', 'shell:protractor_install']);

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);

	grunt.loadNpmTasks('grunt-protractor-runner');

	grunt.registerTask('default', ['jshint', 'protractor:singlerun']);

	grunt.registerTask('test:e2e', ['protractor:singlerun']);

};
