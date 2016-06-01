/*jshint node:true*/
'use strict';
var fs = require('fs');
var path = require('path');
var reporter = require('./reporter.js');

var hasOwnProperty = Object.prototype.hasOwnProperty;
var tsStart;

const screenShotsDir = 'screenshots/';
const __featureDenominator = 'Feature: ';
const __scenarioDenominator = ' - Scenario: ';


function HTMLScreenshotReporter() {
	var self = this;

	self.jasmineStarted = function (summary) {
		tsStart = new Date();
	};

	self.suiteStarted = function (suite) {};

	self.specStarted = function (spec) {
		var featureName = spec.fullName.replace(spec.description, '');
		spec.description = __featureDenominator + featureName + __scenarioDenominator + spec.description + '|' + browser.browserName + '-' + browser.version;
	};

	self.specDone = function (spec) {
		browser.takeScreenshot().then(function (png) {
			writeScreenShot(png, 'target/' + screenShotsDir + sanitizeFilename(spec.description) + '.png');
		});
	};

	self.suiteDone = function (suite) {};

	self.jasmineDone = function () {};

	self.generateHtmlReport = function (inputFile, title, outputFile) {
		var jsonResult = require((path.join(__dirname, '../../' + inputFile)));
		var result = generateReport(jsonResult, title);
		filewrite(result, outputFile);
	};

	return this;
}

module.exports = HTMLScreenshotReporter;

function writeScreenShot(fileData, filePath) {
	var writeStream = fs.createWriteStream(filePath);
	writeStream.write(new Buffer(fileData, 'base64'));
	writeStream.end();
}

function sanitizeFilename(name) {
	name = name.replace(/\s+/g, '-'); // Replace white space with dash
	return name.replace(/[^0-9a-zA-Z\-]/gi, ''); // Strip any special characters except the dash
}

function elapsedTime(tsEnd){
	var timeDiff = tsEnd - tsStart;
	timeDiff /= 1000;
	var seconds = Math.round(timeDiff % 60);
	timeDiff = Math.floor(timeDiff / 60);
	var minutes = Math.round(timeDiff % 60);
	timeDiff = Math.floor(timeDiff / 60);
	var hours = Math.round(timeDiff % 24);
	timeDiff = Math.floor(timeDiff / 24);
	var days = timeDiff ;
	var str = '';
	str += (days>0) ? days + ' days ' : '';
	str += (days>0 || hours>0) ? hours + ' hs. ' : '';
	str += (days>0 || hours>0 || minutes>0) ? minutes + ' mins. ' : '';
	str += seconds + ' secs.';
	return str;
}

function generateReport(jsonstr, automationHeader) {
	var allResults = new Array();
	var testArray = new Array();

	var browserArrayUnique = reporter.getUniqueBrowserNames(jsonstr);

	for (var q = 0; q < jsonstr.length; q++) {
		var browserName = reporter.getBrowserNameFromResult(jsonstr[q]);
		var testName = reporter.getTestNameFromResult(jsonstr[q]);
		var passed = reporter.determineTestStatus(jsonstr[q]);
		allResults.push(passed);
		testArray.push({
			testName : testName,
			browser : browserName,
			res : passed,
			duration: jsonstr[q].duration
		});
	}

	var result = '';
	result += concatHeadSection();
	result += '<html>';
	result += concatReportHeaderSection(automationHeader);
	result += concatRunInfoSection();
	result += concatReportSummary(allResults);
	result += concatSpecResults(testArray, browserArrayUnique);
	result += '</html>';
	return result;
}

function concatSpecResults(testArray, browsers){

	var features = copyResultsToFeatureCollection(testArray);
	var countIndex = 0;
	var result = '';
	browsers.sort();

	for(var f in features){
		result += '<table class="testlist">';

		result += concatSpecTableHeader(f, browsers);

		for(var scen in features[f]){

			if (features[f].hasOwnProperty(scen)) {
				countIndex++;
			}

			result += '<tr><td>' + countIndex + '</td><td class="testname">' + scen + '</td>';

			for (var run in features[f][scen]) {
				for (var b in browsers) {
					var browserName = browsers[b];
					if (browserName === features[f][scen][run].name) {
						if (features[f][scen][run].status == "true") {
							result += '<td class="pass">' + linkToScreenshot(scen, browserName) + 'PASS</a></td>';
						}
						if (features[f][scen][run].status == "false") {
							result += '<td class="fail">' + linkToScreenshot(scen, browserName) + 'FAIL</a></td>';
						}
						if (features[f][scen][run].status == "Skipped") {
							result += '<td class="skip">Skipped (test duration '+features[f][scen][run].duration+'ms)</td>';
						}
					}
				}
			}

			result += '</tr>';
		}

		result += '</tr></table>';
	}
	return result;
}

function concatSpecTableHeader(featureName, sortedBrowsers){
	var result = '<tr><th>Test#</th><th>' + featureName + '</th>';
	for (var i = 0; i < sortedBrowsers.length; i++) {
		result += '<th>' + sortedBrowsers[i] + '</th>';
	}
	result += '</tr>'
	return result;
}

function linkToScreenshot(scenarioName, browserName){
	return '<a href="' + screenShotsDir + sanitizeFilename(scenarioName) + sanitizeFilename(browserName) + '.png">';
}

function copyResultsToFeatureCollection(resultArray){
	var featuresDummy = {};
	for (var i = 0; i < resultArray.length; i++) {
		var offset = __featureDenominator.length;
		var featureName = resultArray[i].testName.substr(offset, resultArray[i].testName.indexOf(__scenarioDenominator)-offset);
		if (!featuresDummy[featureName]) {
			featuresDummy[featureName] = {};
		}

		if (!featuresDummy[featureName][resultArray[i].testName]) {
			featuresDummy[featureName][resultArray[i].testName] = {};
		}

		if (!featuresDummy[featureName][resultArray[i].testName][resultArray[i].browser]) {
			featuresDummy[featureName][resultArray[i].testName][resultArray[i].browser] = {};
		}

		featuresDummy[featureName][resultArray[i].testName][resultArray[i].browser] = {
			name: resultArray[i].browser,
			duration : resultArray[i].duration,
			status : resultArray[i].res
		};
	}
	return featuresDummy;
}

function concatHeadSection(){
	var result = '<head><meta http-equiv="Content-Type" content="text/html" />';
	result += concatCssSection();
	result += '</head>';
	return result;
}

function concatCssSection(){
	var result ='<style type="text/css">';
	result += 'body{';
	result +='	font-family: verdana, arial, sans-serif;';
	result +='}';
	result +='table {';
	result +='	border-collapse: collapse;';
	result +='	display: table;';
	result +='}';
	result +='.header {';
	result +='	font-size: 21px;';
	result +='	margin-top: 21px;';
	result +='	text-decoration: underline;';
	result +='	margin-bottom:21px;';
	result +='}';
	result +='table.runInfo tr {';
	result +='	border-bottom-width: 1px;';
	result +='	border-bottom-style: solid;';
	result +='	border-bottom-color: #d0d0d0;';
	result +='	font-size: 10px;';
	result +='	color: #999999;';
	result +='}';
	result +='table.runInfo td:first-child {';
	result +='	padding-right: 25px;';
	result +='}';
	result +='table.summary {';
	result +='	font-size: 9px;';
	result +='	color: #333333;';
	result +='	border-width: 1px;';
	result +='	border-color: #999999;';
	result +='	margin-top: 21px;';
	result +='}';
	result +='table.summary tr {';
	result +='	background-color: #EFEFEF';
	result +='}';
	result +='table.summary th {';
	result +='	background-color: #DEDEDE;';
	result +='	border-width: 1px;';
	result +='	padding: 6px;';
	result +='	border-style: solid;';
	result +='	border-color: #B3B3B3;';
	result +='}';
	result +='table.summary td {';
	result +='	border-width: 1px;';
	result +='	padding: 6px;';
	result +='	border-style: solid;';
	result +='	border-color: #CFCFCF;';
	result +='	text-align: center';
	result +='}';
	result +='table.testlist {';
	result +='	font-size: 10px;';
	result +='	color: #666666;';
	result +='	border-width: 1px;';
	result +='	border-color: #999999;';
	result +='	margin-top: 21px;';
	result +='	width: 100%;';
	result +='}';
	result +='table.testlist th {';
	result +='	background-color: #CDCDCD;';
	result +='	border-width: 1px;';
	result +='	padding: 6px;';
	result +='	border-style: solid;';
	result +='	border-color: #B3B3B3;';
	result +='}';
	result +='table.testlist tr {';
	result +='	background-color: #EFEFEF';
	result +='}';
	result +='table.testlist td {';
	result +='	border-width: 1px;';
	result +='	padding: 6px;';
	result +='	border-style: solid;';
	result +='	border-color: #CFCFCF;';
	result +='	text-align: center';
	result +='}';
	result +='table.testlist td.pass {';
	result +='	background-color: #BBFFBB;';
	result +='}';
	result +='table.testlist td.clean a {';
	result +='	text-decoration: none;';
	result +='}';
	result +='table.testlist td.fail {';
	result +='	background-color: #FFBBBB;';
	result +='}';
	result +='table.testlist td.skip {';
	result +='	color: #787878;';
	result +='}';
	result +='table.testlist td.testname {';
	result +='	text-align: left;';
	result +='}';
	result +='table.testlist td.totals {';
	result +='	background-color: #CDCDCD;';
	result +='	border-color: #B3B3B3;';
	result +='	color: #666666;';
	result +='	padding: 2px;';
	result += '</style>';
	return result;
}

function concatReportHeaderSection(automationHeader){
	return '<div class="header">' + automationHeader + '</div>';
}

function concatRunInfoSection(){
	var result = '<table class="runInfo"><tr><td>Elapsed time</td><td>' + elapsedTime(new Date()) + '</td></tr>';
	result += '<tr><td>System under test</td><td>' + browser.baseUrl + '</td></tr></table>';
	return result;
}

function concatReportSummary(allResults){
	var pass = reporter.countPassed(allResults);
	var fail = reporter.countFailed(allResults);
	var skipped = reporter.countSkipped(allResults);
	var result = '';
	var total = pass + fail + skipped;
	if(skipped > 0){
		result += '<table class="summary"><tr><th>Total</th><th>Executed</th><th>Pending</th><th>Pass</th><th>Fail</th><th>Pass%</th></tr><tr><td>';
	}else {
		result += '<table class="summary"><tr><th>Total</th><th>Pass</th><th>Fail</th><th>Pass%</th></tr><tr><td>';
	}
	result += total + '</td><td>';
	if(skipped > 0){
		result += (pass+fail) + '</td><td>';
		result += (skipped) + '</td><td>';
	}
	result += pass + '</td><td>';
	result += fail + '</td><td>';
	result += calculatePassPercentage(pass, fail) + '</td></tr></table>';
	return result;
}

function calculatePassPercentage(pass, fail){
	return Math.floor((pass / (pass+fail)) * 100);
}

function filewrite(result, outputFile) {
	fs.writeFileSync(outputFile, result);
}
