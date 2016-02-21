var loginPage = require('../pageobjects/login.page.js');
var welcomePage = require('../pageobjects/welcome.page.js');

describe('Test VizFlow Login Functionality', function () {

	it('should not login with invalid credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL+'ui/HTML5/#/login');
		loginPage.login('bogus', 'morebogus');
		expect(loginPage.getAlertMessage()).toContain('Wrong username or password');
	});


	it('should not login with blank credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL+'ui/HTML5/#/login');
		loginPage.login('admin', '');
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
	});


	it('should login with valid credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL+'ui/HTML5/#/login');
		loginPage.login('admin', 'developer');
		expect(welcomePage.getSearchResultMessage()).toMatch('No Mosaic Reports available');
	});

});
