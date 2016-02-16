var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var jasmineReporters = require('jasmine-reporters');

var reporter = new HtmlScreenshotReporter({
		dest : 'target/testresults',
		filename : 'test-report.html',
		showConfiguration : false,
		reportTitle : null
	});

exports.config = {

	framework : 'jasmine2',

	seleniumServerJar : '../../node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',
	seleniumPort : null,
	chromeDriver : '../../node_modules/protractor/selenium/chromedriver',

	//If seleniumAddress is set, seleniumServerJar, seleniumPort and chromeDriver settings will be ignored
	//and tests will be ran in an already running instance of Selenium server, such as our internal Grid.
	//Alternatively, this can be set by command line using $ grunt --seleniumAddress http://192.168.99.100:4444/wd/hub
	seleniumAddress: 'http://192.168.99.100:4444/wd/hub',

	multiCapabilities : [{
			'browserName' : 'chrome',
			maxInstances : 2,
			shardTestFiles : true
		}, {
			'browserName' : 'firefox',
			maxInstances : 2,
			shardTestFiles : true
		}
	],
	maxSessions : 4,

	// Setup the report before any tests start
	beforeLaunch : function () {
		return new Promise(function (resolve) {
			reporter.beforeLaunch(resolve);
		});
	},

	// Assign the test reporter to each running instance
	onPrepare : function () {
		jasmine.getEnv().addReporter(reporter);
		return browser.getProcessedConfig().then(function (config) {
			var junitReporter = new jasmineReporters.JUnitXmlReporter({
					consolidateAll : true,
					savePath : 'target/testresults',
					filePrefix : config.capabilities.browserName + '-xmloutput',
					modifySuiteName : function (generatedSuiteName, suite) {
						return config.capabilities.browserName + '.' + generatedSuiteName;
					}
				});
			jasmine.getEnv().addReporter(junitReporter);
		});
	},

	jasmineNodeOpts : {
		onComplete : null,
		isVerbose : false,
		showColors : true,
		includeStackTrace : true,
		defaultTimeoutInterval : 90000
	},

	specs : ['specs/*spec.js'],

	// Close the report after all tests finish
	afterLaunch : function (exitCode) {
		return new Promise(function (resolve) {
			reporter.afterLaunch(resolve.bind(this, exitCode));
		});
	}

};
