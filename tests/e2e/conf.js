var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var jasmineReporters = require('jasmine-reporters');
var jSonHTMLReporter = require('../../src/js/html-reporter.js');
var jSonXMLReporter = require('../../src/js/xml-reporter.js');
var ScreenshotReporter = require('../../src/js/screenshot-reporter.js');
var SpecReporter = require('jasmine-spec-reporter');
var os = require('os');
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
	//NOTE: JUnitXmlReporter does not work with sharding
	/*
	capabilities : {
		'browserName' : 'chrome',
		maxInstances : 20,
		shardTestFiles : true
	},
	*/
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

	// Assign the test reporter to each running instance
	onPrepare : function () {

		require('protractor-linkuisref-locator')(protractor);

		jasmine.getEnv().addReporter(
			new ScreenshotReporter({
				savePath : 'target/screenshots'
			}));

		//browser.driver.manage().window().maximize();

		return browser.getProcessedConfig().then(function (config) {
			// you could use other properties here if you want, such as platform and version

			//not used anywhere
			var browserName = config.capabilities.browserName;

			//why is this here?
			jasmine.getEnv().addReporter(new SpecReporter({
					displayStacktrace : 'all'
				}));

			return browser.getCapabilities().then(function (cap) {
				browser.version = cap.caps_.version;
				browser.browserName = cap.caps_.browserName;
				browser.baseURL = 'http://' + getIpAddress() + ':8080/';
			});
		});
	},

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

	afterLaunch : function (exitCode) {
		return new Promise(function (resolve) {
			console.log('jasmine afterLaunch');
			jSonHTMLReporter.generateHtmlReport('./target/protractor-e2e-results.json', 'Protractor End to End Test Results', './target/protractor-e2e-report.html');
			jSonXMLReporter.generateXMLReport('./target/protractor-e2e-results.json', 'Protractor End to End Test Results', './target/protractor-e2e-report.xml');
		});
	}

};
