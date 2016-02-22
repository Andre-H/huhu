var util = require('./util.js')
	, mkdirp = require('mkdirp')
	//, _ = require('underscore')
	, path = require('path');

/** Function: defaultPathBuilder
 * This function builds paths for a screenshot file. It is appended to the
 * constructors base directory and gets prependend with `.png` or `.json` when
 * storing a screenshot or JSON meta data file.
 *
 * Parameters:
 *     (Object) spec - The spec currently reported
 *     (Array) descriptions - The specs and their parent suites descriptions
 *     (Object) result - The result object of the current test spec.
 *     (Object) capabilities - WebDrivers capabilities object containing
 *                             in-depth information about the Selenium node
 *                             which executed the test case.
 *
 * Returns:
 *     (String) containing the built path
 */
function defaultPathBuilder(spec, descriptions, results, capabilities) {
	return util.generateGuid();
}

function sanitizeFilename(name){
    name = name.replace(/\s+/gi, '-'); // Replace white space with dash
    return name.replace(/[^a-zA-Z0-9\-]/gi, ''); // Strip any special charactere
}

/** Class: DecoReporter
*/
function DecoReporter(){
	
	var self = this;

	this.baseDirectory = 'fotaas';
	this.docTitle = 'Generated test report';
	this.docHeader =  'Test Results';
	this.docName =  'report.html';
	
	var fs = require('fs');
		function writeScreenShot(data, filename) {
			var stream = fs.createWriteStream(filename);
			stream.write(new Buffer(data, 'base64'));
			stream.end();
		}
	
	
	
	
    self.jasmineStarted = function(summary) {
		//console.log('jasmineStarted');
	};
    self.suiteStarted = function(suite) {
		//console.log('suiteStarted - suite:'+JSON.stringify(suite, null, 4));
	};
    self.specStarted = function(spec) {
		//console.log('specStarted - spec:'+JSON.stringify(spec, null, 4));
	};
    self.specDone = function(spec) {
		
		console.log('specDone - spec.id:'+spec.id);//JSON.stringify(spec, null, 4));
	
		return browser.takeScreenshot().then(function (png) {
			writeScreenShot(png, 'target/screenshots/'+sanitizeFilename(spec.description)+'.png');
		});
		
var speco = {
    "id": "spec2",
    "description": "should login with valid credentials |undefined|undefined",
    "fullName": "Test VizFlow Login Functionality should login with valid credentials |undefined|undefined",
    "failedExpectations": [
        {
            "matcherName": "",
            "message": "Failed: Angular could not be found on the page undefinedui/HTML5/#/login : retries looking for angublablablablalbalblalble (module.js:410:26)\n    at Object.Module._extensions..js (module.js:417:10)\n    at Module.load (module.js:344:32)\n    at Function.Module._load (module.js:301:12)",
            "passed": false,
            "expected": "",
            "actual": ""
        }
    ],
    "passedExpectations": [],
    "pendingReason": "",
    "status": "failed"
}


	
	};
    self.suiteDone = function(suite) {
		//console.log('suiteDone - suite'+JSON.stringify(suite, null, 4));
	};
    self.jasmineDone = function() {
		console.log('jasmineDone');
	};
	
	
	
	
    return this;
}

/** Function: reportSpecResults
 * Called by Jasmine when reporting results for a test spec. It triggers the
 * whole screenshot capture process and stores any relevant information.
 *
 * Parameters:
 *     (Object) spec - The test spec to report.
 */
DecoReporter.prototype.reportSpecResults =


function reportSpecResults(spec) {
	/* global browser */
	var self = this
		, results = spec.results()
		, takeScreenshot
		, finishReport;


	takeScreenshot = true;//!(self.takeScreenShotsOnlyForFailedSpecs && results.passed());

	finishReport = function(png) {

		browser.getCapabilities().then(function (capabilities) {
			var descriptions = util.gatherDescriptions(
					spec.suite
					, [spec.description]
				)


				, baseName = self.pathBuilder(
					spec
					, descriptions
					, results
					, capabilities
				)
				, metaData = self.metaDataBuilder(
					spec
					, descriptions
					, results
					, capabilities
				)

				, screenShotFile = baseName + '.png'
				, metaFile = baseName + '.json'
				, screenShotPath = path.join(self.baseDirectory, screenShotFile)
				, metaDataPath = path.join(self.baseDirectory, metaFile)

				// pathBuilder can return a subfoldered path too. So extract the
				// directory path without the baseName
				, directory = path.dirname(screenShotPath);

			metaData.screenShotFile = screenShotFile;
			mkdirp(directory, function(err) {
				if(err) {
					throw new Error('Could not create directory ' + directory);
				} else {
					util.addMetaData(metaData, metaDataPath, descriptions, self.finalOptions);
					if(takeScreenshot) {
						util.storeScreenShot(png, screenShotPath);
					}
					if (!self.finalOptions.disableMetaData) {
						util.storeMetaData(metaData, metaDataPath);
					}
				}
			});
		});

	};

	if (takeScreenshot) {

		browser.takeScreenshot().then(function (png) {
			finishReport(png);
		});

	} else {

		finishReport();

	}


};

module.exports = DecoReporter;