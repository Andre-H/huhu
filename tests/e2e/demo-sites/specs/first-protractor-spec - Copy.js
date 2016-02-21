describe('testing angular example application', function() {

  it('should pick a phone in the phone selection tool |'+browser.browserName+'|'+browser.version, function() {

	browser.get('http://whichphone.withgoogle.com/');
	
	element(by.buttonText('Get started')).click();
	
	var phonePurposes = element.all(by.repeater('item in vm.behaviorData'));
	
	phonePurposes.get(0).element(by.className('flip-container')).click();
	
	element(by.id('umi-usage-high')).element(by.className('ng-binding')).click();
	
	element(by.className('umi-story-next-btn')).click();
	
	if(browser.browserName != 'chrome'){
		expect(false).toEqual(true);
	}
	
  });
});