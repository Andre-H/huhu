var examplePage = require('../pageobjects/example.page.js');

describe('Example Functionality - Super Calculator', function () {

	beforeEach(function(){
		browser.get('/protractor-demo');//uses baseUrl from confiuration
	});

	it('should add 1 and 2', function () {
		examplePage.setFirstNumber(1);
		examplePage.setOperation('+');
		examplePage.setSecondNumber(2);
		examplePage.clickGo();
		expect(examplePage.getResult()).toEqual('I want this test to fail on purpose, so we can see the exception in the report.');
	});

	it('should subtract 2 and 2', function () {
		examplePage.setFirstNumber(2);
		examplePage.setOperation('-');
		examplePage.setSecondNumber(2);
		examplePage.clickGo();
		expect(examplePage.getResult()).toEqual('0');
	});

	xit('should not divide by zero', function () {
		examplePage.setFirstNumber(999999999);
		examplePage.setOperation('/');
		examplePage.setSecondNumber(0);
		examplePage.clickGo();
		expect(examplePage.getResult()).toEqual('Infinity');
	});

});
