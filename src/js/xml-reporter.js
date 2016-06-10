/*jshint node:true*/
'use strict';
var fs = require('fs');
var path = require('path');
var XMLWriter = require('xml-writer');
var reporterUtils = require('./reporter.js');

var hasOwnProperty = Object.prototype.hasOwnProperty;


function XMLReporter(options) {
	var self = this;

	self.generateXMLReport = function (inputFile, title) {
		var jsonResult = require((path.join(__dirname, '../../' + inputFile)));
		var result = generateReport(jsonResult, options.title);
		fs.writeFileSync(options.xmlReportDestPath, result);
	};

	function generateReport(jsonstr, automationHeader) {

		var allResults = new Array();
		var testArray = new Array();
		var totalTime = 0;

		for (var q = 0; q < jsonstr.length; q++) {
			var browserName = reporterUtils.getBrowserNameFromResult(jsonstr[q]);
			var testName = reporterUtils.getTestNameFromResult(jsonstr[q]);
			var passed = reporterUtils.determineTestStatus(jsonstr[q]);
			allResults.push(passed);
			testArray.push({
				testName : testName,
				browser : browserName,
				res : passed,
				duration: jsonstr[q].duration,
				description: jsonstr[q].description,
				assertions: jsonstr[q].assertions
			});
			totalTime += (jsonstr[q].duration / 1000);
		}

		var xw = new XMLWriter(true);
		xw.startDocument();
		xw.startElement('testsuite');

		var failCount = reporterUtils.countFailed(allResults);
		if (failCount > 0) {
			xw.writeAttribute('errors', failCount);
			xw.writeAttribute('failures', failCount);
		}
		xw.writeAttribute('tests', jsonstr.length);
		xw.writeAttribute('name', automationHeader);
		xw.writeAttribute('time', totalTime);
		xw.writeAttribute('timestamp', new Date().toISOString());

		for (var t = 0; t < testArray.length; t++) {
			xw.startElement('testcase');
			xw.writeAttribute('className', testArray[t].description);
			xw.writeAttribute('name', testArray[t].description);
			xw.writeAttribute('time', testArray[t].duration / 1000);
			if(allResults[t] != "true") {
				if(allResults[t] == 'Skipped'){
					xw.startElement('skipped');
					xw.writeAttribute('message', 'Skipped reason not provided by Protractor');
				}else {
					xw.startElement('failure');
					xw.writeAttribute('type', 'testfailure');
					for (var jk = 0; jk < testArray[t].assertions.length; jk++) {
						xw.text(testArray[t].assertions[jk].errorMsg + '. ');
						xw.text(testArray[t].assertions[jk].stackTrace + '. ');
					}
				}
				xw.endElement(); //failure
			}
			xw.endElement(); //testcase
		}

		xw.writeElement('system-out', 'beta');
		xw.endElement(); //testsuite
		xw.endDocument();

		return xw.toString();
	}

	return this;
}

module.exports  = XMLReporter;


