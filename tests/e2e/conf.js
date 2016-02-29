var os = require('os');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter');
var jSonHTMLReporter = require('../../src/js/html-reporter.js');
var jSonXMLReporter = require('../../src/js/xml-reporter.js');
var HTMLScreenshotReporter = require('../../src/js/html-reporter.js');
var htmlReporter = new HTMLScreenshotReporter({savePath : 'screenshots/'});
var waitPlugin = require('../../src/js/wait-plugin.js');

function getIpAddress() {
	var ipAddress = null;
	var ifaces = os.networkInterfaces();
	function processDetails(details) {
		if (details.family === 'IPv4' && details.address !== '127.0.0.1' && !ipAddress) {
			ipAddress = details.address;
		}
	}
	for (var dev in ifaces) {
		ifaces[dev].forEach(processDetails);
	}
	return ipAddress;
}

exports.config = {

	framework : 'jasmine2',

	plugins : [{
			path : '../../src/js/wait-plugin.js'
		}
	],

	seleniumServerJar : '../../node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',

	seleniumPort : null,

	chromeDriver : '../../node_modules/protractor/selenium/chromedriver',

	//If seleniumAddress is set, seleniumServerJar, seleniumPort and chromeDriver settings will be ignored
	//and tests will be ran in an already running instance of Selenium server, such as our internal Grid.
	//Alternatively, this can be set by command line using $ grunt --seleniumAddress http://192.168.99.100:4444/wd/hub
	seleniumAddress : 'http://192.168.99.100:4444/wd/hub',

	//For multiCapabilities (testing in parallel with multiple browsers, use this
	//NOTE: PhantomJS works but is not recommended by Protractor
	//also, why a fake browser when you can test on the real browser?
	
	multiCapabilities : [
	{
		'browserName' : 'chrome',
		maxInstances : 2,
		shardTestFiles : true
	}
	,
	{
		'browserName' : 'firefox',
		maxInstances : 2,
		shardTestFiles : true
	}
	],

	maxSessions : 20,

	//If multiCapabilities is not desired, use this instead
	/*
	capabilities : {
		'browserName' : 'chrome',
		maxInstances : 20,
		shardTestFiles : true
	},
	*/
	
	//Restarting your browser between every test ensures independency at the cost of total execution time
	//restartBrowserBetweenTests:true,

	// Setup before any tests start
	beforeLaunch : function () {
		var newFolder = "";
		mkdirp('./target/screenshots', function (err) {
			if (err) {
				console.error(err);
			}
		});
	},

	onPrepare : function () {

		require('protractor-linkuisref-locator')(protractor);

		// Assign the test reporters to each running instance
		
		jasmine.getEnv().addReporter(htmlReporter);
		
		jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace : 'all'}));
		
		//Provide browser with capability information so specs can access it

		return browser.getProcessedConfig().then(function (config) {
			return browser.getCapabilities().then(function (cap) {
				browser.version = cap.caps_.version;
				browser.browserName = cap.caps_.browserName;
				browser.baseURL = 'http://' + getIpAddress() + ':8080/';
			});
		});
	},

	//Ensure Protractor does not closes browser until all reporting is done (including taking screenshots)
	onComplete : function () {
		return waitPlugin.resolve();
	},

	jasmineNodeOpts : {
		isVerbose : true,
		showColors : true,
		includeStackTrace : true,
		defaultTimeoutInterval : 90000,
		print : function () {}
	},

	specs : [
		//'./demo-sites/specs/*spec.js',
		'./login/specs/*spec.js'
	],

	resultJsonOutputFile : './target/protractor-e2e-results.json',

	//Post process
	afterLaunch : function (exitCode) {
		return new Promise(function (resolve) {
			console.log('jasmine afterLaunch');
			htmlReporter.generateHtmlReport('./target/protractor-e2e-results.json', 'Protractor End to End Test Results', './target/protractor-e2e-report.html');
			jSonXMLReporter.generateXMLReport('./target/protractor-e2e-results.json', 'Protractor End to End Test Results', './target/protractor-e2e-report.xml');
		});
	}

};
