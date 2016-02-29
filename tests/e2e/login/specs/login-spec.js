var loginPage = require('../pageobjects/login.page.js');
var systemInfoPage = require('../pageobjects/systemInfo.page.js');
var welcomePage = require('../pageobjects/welcome.page.js');

describe('Test VizFlow Login Functionality', function () {

	it('should display system info at the login page |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.gotoSystemInfoPage();
		expect(systemInfoPage.getSystemInfoJenkinsJob()).toMatch('HTML5');
		systemInfoPage.closeSystemInfoPage();
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
	});

	it('should not login with invalid credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.login('bogus', 'morebogus');
		expect(loginPage.getAlertMessage()).toContain('Wrong username or password');
	});

	it('should not login with blank credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.login('admin', '');
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
		loginPage.login('', 'developer');
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
		loginPage.login('', '');
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
	});

	it('should login with valid credentials |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.login('admin', 'developer');
		expect(welcomePage.getSearchResultMessage()).toMatch('No Mosaic Reports available');
	});

	it('should logout |' + browser.browserName + '|' + browser.version, function () {
		welcomePage.logout();
		expect(loginPage.getLoginFormMessage()).toContain('Please login');
	});

	it('should not login to the wrong server selection) |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.selectServer('http://tearo.internal.bis2.net:56565');
		loginPage.login('admin', 'developer');
		expect(loginPage.getAlertMessage()).toMatch('Could not connect to the server. Make sure your network is working and the server is running. Check the browser console log for more information.');
	});
	
	it('should restric access to a user that has not admin role |' + browser.browserName + '|' + browser.version, function () {
		browser.get(browser.baseURL + 'ui/HTML5/#/login');
		loginPage.selectServer(browser.baseURL);//'http://172.86.160.88:8080');
		loginPage.login('user1', 'user1');
		expect(welcomePage.getAllUserMenuOptions()).toMatch('System Info ...\nHelp ...\nUser Settings ...\nLogout');
	});

	
});
