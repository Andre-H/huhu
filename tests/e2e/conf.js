var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var jasmineReporters = require('jasmine-reporters');

var reporter = new HtmlScreenshotReporter({
		dest : 'target/testresults',
		filename : 'test-report.html'
	});

exports.config = {

	framework : 'jasmine2',

	seleniumAddress : 'http://192.168.99.100:4444/wd/hub',

	capabilities : {
		browserName : 'chrome'
	},

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
