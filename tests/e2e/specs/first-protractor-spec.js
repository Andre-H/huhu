describe('testing angular example application', function() {

  
  it('should pick a phone in the phone selection tool', function() {

	browser.get('http://whichphone.withgoogle.com/');
	
	element(by.buttonText('Get started')).click();
	
	var phonePurposes = element.all(by.repeater('item in vm.behaviorData'));
	
	phonePurposes.get(0).element(by.className('flip-container')).click();
	
	element(by.id('umi-usage-high')).element(by.className('ng-binding')).click();
	
	element(by.className('umi-story-next-btn')).click();
	
  });
});


	
	/*
	var whatsImportantInAPhone = element.all(by.repeater('item in vm.currentFollowUp.answers'));
	whatsImportantInAPhone.get(1).element(by.className('ng-binding')).click();
	
	element(by.className('umi-followup-done')).element(by.tagName('button')).click();	
	
	expect(element(by.className('umi-marquee-step')).getText()).toContain('Great! What else?');
	expect(element(by.className('umi-marquee-step')).getText()).toContain('Two more to go.');
	*/