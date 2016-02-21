'use strict';

module.exports = {

	welcomePage : {
		//All elements in the page / section
		searchReportsField : element(by.model('searchValue')),
		emptySearchResultsPane : element (by.css('#collapsibleMosaicReports > div > div.margin-5.ng-binding')),
		searchResultsPane : element (by.css('#collapsibleVisualDocuments > p')),
		newReportButton : element(by.css('#mosaicReportsGridToolbar > a:nth-child(2)'))
	},
	
	typeInSearchReportsField: function(searchQuery){
		var welcomePage = this.welcomePage;
		
		welcomePage.searchReportsField.sendKeys(searchQuery);
	},
	
	getSearchResultMessage: function(searchQuery){
		var welcomePage = this.welcomePage;
		
		return welcomePage.emptySearchResultsPane.getText();
	},
	
	getVisualDocumentsSearchResultMessage: function(searchQuery){
		var welcomePage = this.welcomePage;
		
		return welcomePage.searchResultsPane.getText();
	},
		
	clickNewReportButton: function(){
		var welcomePage = this.welcomePage;
		
		return welcomePage.newReportButton.click();
	}
	
};
	
	