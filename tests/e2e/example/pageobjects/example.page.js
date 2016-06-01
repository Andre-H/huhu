'use strict';
var HTMLSelectHelper = require('../../helpers/html-select.helper.js');

module.exports = {

	examplePage : {
		//All elements in the page / section
		firstNumberField : element(by.model('first')),
		secondNumberField : element(by.model('second')),
		operator : element(by.model('operator')),
		goButton : element(by.id('gobutton')),
		resultField : element(by.binding('latest'))
	},

	getExamplePage : function () {
		return this.examplePage;
	},

	setFirstNumber : function (number) {
		this.getExamplePage().firstNumberField.clear();
		this.getExamplePage().firstNumberField.sendKeys(number);
	},

	setSecondNumber : function (number) {
		this.getExamplePage().secondNumberField.clear();
		this.getExamplePage().secondNumberField.sendKeys(number);
	},

	clickGo : function () {
		this.getExamplePage().goButton.click();
	},

	getResult : function () {
		return this.getExamplePage().resultField.getText();
	},

	setOperation : function (operator) {
		new HTMLSelectHelper(this.getExamplePage().operator).selectOptionByName(operator);
	}

};
