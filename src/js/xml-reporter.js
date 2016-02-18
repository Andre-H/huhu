/*jshint node:true*/
'use strict';
var fs = require('fs');
var path = require('path');
var XMLWriter = require('xml-writer');
var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.generateXMLReport = function (inputFile, title, outputFile) {

	var sortedJson = require((path.join(__dirname, '../' + inputFile)));
	var automationHeader = title;
	sortOn(sortedJson, 'description', false, false);
	var result = generateReport(sortedJson, automationHeader);
	fs.writeFileSync(outputFile, result);

};

function generateReport(jsonstr, automationHeader) {
	var passCount = new Array();
	var failCount = 0;
	var skippedCount = new Array();
	var browserArray = new Array();
	var testArray = new Array();
	var testrunArray = new Array();
	var keyValuePair;
	var elapsedTime = 0;

	//do stuff here, return result as string
	var xw = new XMLWriter(true);
	xw.startDocument();
	xw.startElement('testsuite');

	for (var q = 0; q < jsonstr.length; q++) {
		var browsername = jsonstr[q].description.split('|')[1] + '-' + jsonstr[q].description.split('|')[2];
		var browserrunner = jsonstr[q].description.split('|')[1];
		var testmapper = browsername + '~' + jsonstr[q].description.split('|')[0]
			var assertions = jsonstr[q].assertions;
		var assertionsArray = new Array();
		var passed = "";
		var failedtest = new Array();
		for (var jk = 0; jk < assertions.length; jk++) {
			assertionsArray.push(assertions[jk].passed);
		}
		if (assertionsArray.length > 0) {
			for (var ijk = 0; ijk < assertionsArray.length; ijk++) {
				if (assertionsArray[ijk] == false) {
					failedtest.push("failed");
				}
				if (failedtest.length > 0) {
					passed = "false";
				}
				if (failedtest.length <= 0) {
					passed = "true";
				}
			}
		} else {
			passed = "true";
			//passed = "Skipped";
			//skippedCount.push("Skipped");
		}
		passCount.push(passed);
		testArray.push({
			testName : jsonstr[q].description.split('|')[0],
			browser : browsername,
			browserrunner : browserrunner,
			testmapper : testmapper,
			res : passed
		});
		elapsedTime += jsonstr[q].duration;
		if (passed != "true") {
			failCount++;
		}
	}
	if (failCount > 0) {
		xw.writeAttribute('errors', failCount);
		xw.writeAttribute('failures', failCount);
	}
	xw.writeAttribute('tests', jsonstr.length);
	xw.writeAttribute('name', automationHeader);
	xw.writeAttribute('time', elapsedTime);
	xw.writeAttribute('timestamp', new Date().toISOString());

	for (var q = 0; q < jsonstr.length; q++) {
		var browsername = jsonstr[q].description.split('|')[1] + '-' + jsonstr[q].description.split('|')[2];
		var browserrunner = jsonstr[q].description.split('|')[1];
		var testmapper = browsername + '~' + jsonstr[q].description.split('|')[0]
			var assertions = jsonstr[q].assertions;
		var assertionsArray = new Array();
		var passed = "";
		var failedtest = new Array();
		for (var jk = 0; jk < assertions.length; jk++) {
			assertionsArray.push(assertions[jk].passed);
		}
		if (assertionsArray.length > 0) {
			for (var ijk = 0; ijk < assertionsArray.length; ijk++) {
				if (assertionsArray[ijk] == false) {
					failedtest.push("failed");
				}
				if (failedtest.length > 0) {
					passed = "false";
				}
				if (failedtest.length <= 0) {
					passed = "true";
				}
			}
		} else {
			passed = "true";
			//passed = "Skipped";
			//skippedCount.push("Skipped");
		}
		xw.startElement('testcase');
		xw.writeAttribute('className', jsonstr[q].description);
		xw.writeAttribute('name', jsonstr[q].description);
		xw.writeAttribute('time', jsonstr[q].duration);
		if (passed != "true") {
			xw.startElement('failure');
			xw.writeAttribute('type', 'testfailure');
			for (var jk = 0; jk < assertions.length; jk++) {
				xw.text(assertions[jk].errorMsg + '. ');
				xw.text(assertions[jk].stackTrace + '. ');
			}
			xw.endElement(); //failure
		}
		xw.endElement(); //testcase
	}
	xw.writeElement('system-out', 'beta');
	xw.endElement(); //testsuite
	xw.endDocument();
	/*
	<?xml version="1.0" encoding="UTF-8" ?>
	<testsuite
	errors="1"
	failures="1"
	hostname="mahmood-alis-macbook-pro.local"
	name="tests.ATest"
	tests="3"
	time="0.069"
	timestamp="2009-12-19T17:58:59">
	 */
	/*
	<testcase classname="tests.ATest" name="error" time="0.0060">
	<error type="java.lang.RuntimeException">java.lang.RuntimeException	at tests.ATest.error(ATest.java:11)</error>
	</testcase>

	<testcase classname="tests.ATest" name="fail" time="0.0020">
	<failure type="junit.framework.AssertionFailedError">junit.framework.AssertionFailedError: 	at tests.ATest.fail(ATest.java:9)</failure>
	</testcase>

	<testcase classname="tests.ATest" name="sucess" time="0.0" />
	<system-out><![CDATA[here]]></system-out>
	<system-err><![CDATA[]]></system-err>

	</testsuite>';
	 */

	return xw.toString();
}

function sortOn(arr, prop, reverse, numeric) {
	if (!prop || !arr) {
		return arr
	}
	var sort_by = function (field, rev, primer) {
		return function (a, b) {
			a = primer(a[field]),
			b = primer(b[field]);
			return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
		}
	}
	if (numeric) {
		arr.sort(sort_by(prop, reverse, function (a) {
				return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
			}));
	} else {
		arr.sort(sort_by(prop, reverse, function (a) {
				return String(a).toUpperCase();
			}));
	}
}
