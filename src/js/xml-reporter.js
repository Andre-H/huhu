/*jshint node:true*/
'use strict';
var fs = require('fs');
var path = require('path');
var XMLWriter = require('xml-writer');
var reporter = require('./reporter.js');

var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.generateXMLReport = function (inputFile, title, outputFile) {
	var jsonResult = require((path.join(__dirname, '../../' + inputFile)));
	var result = generateReport(jsonResult, title);
	fs.writeFileSync(outputFile, result);
};

function generateReport(jsonstr, automationHeader) {

	var allResults = new Array();
	var testArray = new Array();
	var totalTime = 0;

	for (var q = 0; q < jsonstr.length; q++) {
		var browserName = reporter.getBrowserNameFromResult(jsonstr[q]);
		var testName = reporter.getTestNameFromResult(jsonstr[q]);
		var passed = reporter.determineTestStatus(jsonstr[q]);
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

	var failCount = reporter.countFailed(allResults);
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
