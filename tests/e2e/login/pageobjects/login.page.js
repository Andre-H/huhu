'use strict';
var userMenu = require('./userMenu.pageobject.js');

module.exports = {

	loginPage : {
		//All elements in the page / section
		usernameField : element(by.model('loginFormUserName')),
		passwordField : element(by.model('loginFormPassword')),
		loginButton : element(by.buttonText('Login')),
		alertMessageField : element(by.css('body > div > div > div > div:nth-child(2) > form > div.alert.alert-danger.ng-binding')),
		loginFormMessageField : element(by.css('body > div > div > div > div:nth-child(2) > form > h3')),
		serverField : element(by.css('body > div > div > div > div:nth-child(2) > form > div.btn-group.margin-bottom.btn-block > button'))
	},

	login : function (username, password) {
		var loginPage = this.loginPage;

		loginPage.usernameField.clear();
		loginPage.passwordField.clear();
		loginPage.usernameField.sendKeys(username);
		loginPage.passwordField.sendKeys(password);
		loginPage.loginButton.click();
	},

	gotoSystemInfoPage : function () {
		userMenu.gotoSystemInfoPage();
	},

	getAlertMessage : function () {
		var loginPage = this.loginPage;

		return loginPage.alertMessageField.getText();
	},

	getLoginFormMessage : function () {
		var loginPage = this.loginPage;

		return loginPage.loginFormMessageField.getText();
	},

	selectServer : function (serverDescription) {
		var loginPage = this.loginPage;

		loginPage.serverField.click();
		var menuElements = element.all(by.repeater('domain in serverService.getServers()'));
		return menuElements.filter(function(elem){
			return elem.getText().then(function(text){
				return serverDescription.match(text);
			});
		}).click();
	}

};
