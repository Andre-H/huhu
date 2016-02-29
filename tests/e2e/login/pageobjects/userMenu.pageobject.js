'use strict';

module.exports = {

	userMenu : {
		navbarUserButton : element(by.css('body > div > div > div > div.ng-scope > nav > div > div.collapse.navbar-collapse > ul > li.ng-scope > button')),
		navbarUserButtonWhenLoggedIn : element(by.css('body > div > div > div:nth-child(1) > nav > div > div.collapse.navbar-collapse > ul.nav.navbar-nav.navbar-right > li.ng-scope > button')),
		systemInfoButton : element(by.linkUiSref('sysinfo')),
		loginButton : element(by.linkText(' Login ...')),
		logoutButton : element(by.css('[ng-click="logout();"]')),
		contextMenuList : element(by.css('body > div > div > div:nth-child(1) > nav > div > div.collapse.navbar-collapse > ul.nav.navbar-nav.navbar-right > li.ng-scope.open > ul'))
	},

	gotoSystemInfoPage : function () {
		var userMenu = this.userMenu;

		userMenu.navbarUserButton.click();
		userMenu.systemInfoButton.click();
	},

	gotoLoginPage : function () {
		var userMenu = this.userMenu;

		userMenu.navbarUserButton.click();
		userMenu.loginButton.click();
	},

	logout : function () {
		var userMenu = this.userMenu;

		userMenu.navbarUserButtonWhenLoggedIn.click();
		userMenu.logoutButton.click();
	},
	
	getAllOptions : function () {
		var userMenu = this.userMenu;
		
		userMenu.navbarUserButtonWhenLoggedIn.click();
		return userMenu.contextMenuList.getText();
	}
};
