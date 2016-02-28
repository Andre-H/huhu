'use strict';
var userMenu = require('./userMenu.pageobject.js');

module.exports = {

	welcomePage : {
		emptySearchResultsPane : element(by.css('#collapsibleMosaicReports > div > div.margin-5.ng-binding'))
	},

	getSearchResultMessage : function (searchQuery) {
		var welcomePage = this.welcomePage;

		return welcomePage.emptySearchResultsPane.getText();
	},

	logout : function () {
		userMenu.logout();
	}

};
