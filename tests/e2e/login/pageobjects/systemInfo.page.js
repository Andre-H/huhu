'use strict';

module.exports = {

	systemInfoPage : {
		systemInfoJenkinsJobField : element(by.model('systemInfo.frontEndBuildInfo.jenkinsJobName')),
		closeSystemInformationButton : element(by.css('body > div > div > div > div.fixed-width-container > div.btn-group.pull-right > button')) //buttonText('Close '))
	},

	getSystemInfoJenkinsJob : function () {
		var systemInfoPage = this.systemInfoPage;

		return systemInfoPage.systemInfoJenkinsJobField.getAttribute('value').then(
			function (value) {
			return value;
		});
	},

	closeSystemInfoPage : function () {
		var systemInfoPage = this.systemInfoPage;

		systemInfoPage.closeSystemInformationButton.click();
	}
};
