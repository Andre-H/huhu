var loginPage = require('../pageobjects/login.page.js');
var welcomePage = require('../pageobjects/welcome.page.js');

describe('Test VizFlow Create a New Visual Document Functionality', function () {

	it('should not crash when I click new Report |' + browser.browserName + '|' + browser.version, function () {
		browser.get('http://localhost:8080/ui/HTML5/');
		loginPage.login('admin','developer');
		welcomePage.clickNewReportButton();
		expect(welcomePage.getVisualDocumentsSearchResultMessage()).toMatch('No Visual Documents available');
	});

});