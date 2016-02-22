
describe('testing angular example application', function () {

	it('should pick a phone in the phone selection tool |' + browser.browserName + '|' + browser.version, function () {

		browser.get('http://whichphone.withgoogle.com/');

		element(by.buttonText('Get started')).click();

		var phonePurposes = element.all(by.repeater('item in vm.behaviorData'));

		phonePurposes.get(0).element(by.className('flip-container')).click();

		element(by.id('umi-usage-high')).element(by.className('ng-binding')).click();

		element(by.className('umi-story-next-btn')).click();

		expect(browser.browserName).toEqual('firefox');
		this.fpt = 'sfd1';
	});

	it('should add one and two|' + browser.browserName + '|' + browser.version, function () {

		browser.get('http://juliemr.github.io/protractor-demo/');

		element(by.model('first')).sendKeys(1);

		element(by.model('second')).sendKeys(2);

		element(by.id('gobutton')).click();

		expect(element(by.binding('latest')).getText()).toEqual('3'); // This is wrong!
		this.fpt = 'sfd2';
	});
});
