'use strict';

describe('ospreyCoreApp', function() {

	browser.get('http://localhost:8080');

	var loginEmail = element(by.model('loginData.email'));
	var loginPassword = element(by.model('loginData.password'));

	var regEmail = element(by.model('initRegData.email'));

	//first e2e test
	it('should have the title', function() {
		expect(browser.getTitle()).toEqual('Osprey');
	}); 

	//registers a parent
	it('should register a parent and go to dashboard', function() {
		element(by.css('#parentButton')).click();

		//goes to regParent
		regEmail.sendKeys('psdpar@ent.com');

		//next-button
		element(by.css('#next-button')).click();

		element(by.model('regData.password')).sendKeys('ilovenick');
		element(by.css('#regParent')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
		browser.navigate().back();
		browser.navigate().back();

	});

	//registers a physician
	it('should register a physician and go to dashboard', function() {
		element(by.css('#physButton')).click();

		//goes to regPhysician
		regEmail.sendKeys('psdphys@ician.com');

		//next-button
		element(by.css('#next-button')).click();

		element(by.model('regData.password')).sendKeys('ilovenick');
		element(by.css('#regPhysician')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
		browser.navigate().back();
		browser.navigate().back();

	});

	//invalid login check
	it('should catch invalid emails and passwords', function() {
		var alertMsg = element(by.binding('alert.msg'));

		loginEmail.sendKeys('cantwaitforthenbaseasontostart@letsgo.com');
		loginPassword.sendKeys('ilovenickjiang');
		element(by.css('#signin-button')).click();

		expect(alertMsg.getText()).toEqual('Invalid email or password!');
		loginEmail.clear();
		loginPassword.clear();
	});

		//valid login and dashboard check
	it('should have new user in dashboard', function() {
		
		loginEmail.sendKeys('psdpar@ent.com');
		loginPassword.sendKeys('ilovenick');
		//sign in button
		element(by.css('#signin-button')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));

	});

	it('should logout and return to splash page', function() {
		element(by.css('#logout-button')).click();
		expect(browser.get('http://localhost:8080/#/'));
	});

	it('should not allow a user to navigate between pages without following the correct process', function() {
		// test browser navigation between pages
	});

});

