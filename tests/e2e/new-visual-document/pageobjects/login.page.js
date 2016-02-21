'use strict';

module.exports = {

	loginPage : {
		//All elements in the page / section
		usernameField : element(by.model('loginFormUserName')),
		passwordField : element(by.model('loginFormPassword')),
		loginButton : element(by.buttonText('Login')),
		alertMessageField : element(by.css('body > div > div > div > div:nth-child(2) > form > div.alert.alert-danger.ng-binding')),
		loginFormMessageField : element(by.css('body > div > div > div > div:nth-child(2) > form > h3')),
		navbarUserButton : element(by.css('body > div > div > div > div.ng-scope > nav > div > div.collapse.navbar-collapse > ul > li.ng-scope > button')),
		navbarUserContextMenuSystemInfoButton : element(by.linkText(' System Info ...')),
		navbarUserContextMenuLoginButton : element(by.linkText(' Login ...')),
		systemInfoJenkinsJobField : element(by.model('systemInfo.frontEndBuildInfo.jenkinsJobName')),
		closeSystemInformationButton : element(by.buttonText('Close '))
	},

	login : function (username, password) {
		var loginPage = this.loginPage;

		loginPage.usernameField.sendKeys(username);
		loginPage.passwordField.sendKeys(password);
		loginPage.loginButton.click();
	},

	gotoSystemInformation : function () {
		var loginPage = this.loginPage;

		loginPage.navbarUserButton.click();
		loginPage.navbarUserContextMenuSystemInfoButton.click();
	},

	getSystemInfoJenkinsJob : function () {
		var loginPage = this.loginPage;

		return loginPage.systemInfoJenkinsJobField.getText();
	},

	gotoLoginForm : function () {
		var loginPage = this.loginPage;

		loginPage.navbarUserButton.click();
		loginPage.navbarUserContextMenuLoginButton.click();
	},
	
	getAlertMessage : function () {
		var loginPage = this.loginPage;
		
		return loginPage.alertMessageField.getText();
	},
	
	getLoginFormMessage : function () {
		var loginPage = this.loginPage;
		
		return loginPage.loginFormMessageField.getText();
	}
	
};
