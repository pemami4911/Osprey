'use strict';

describe('ospreyCoreApp', function() {

	browser.get('http://localhost:8080');

	var loginEmail = element(by.model('loginData.email'));
	var loginPassword = element(by.model('loginData.password'));

	//first e2e test
	it('should have the title', function() {
		expect(browser.getTitle()).toEqual('Osprey');
	});

	//register check1
	it('should register a user and go to dashboard', function() {
		element(by.model('initRegData.userType')).click();
		element(by.model('initRegData.email')).sendKeys('psd@psd.com');
		//next-button
		element(by.css('#next-button')).click();

		element(by.model('regData.password')).sendKeys('ilovenick');
		element(by.css('#regParent')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
		browser.navigate().back();
		browser.navigate().back();

	});

	//invalid login check
	it('should catch invalid emails and passwords', function() {
		var alertMsg = element(by.binding('alert.msg'));

		loginEmail.sendKeys('psd@psd.co');
		loginPassword.sendKeys('ilovenic');
		element(by.css('#signin-button')).click();

		expect(alertMsg.getText()).toEqual('Invalid email or password!');
		loginEmail.clear();
		loginPassword.clear();
	});

		//valid login and dashboard check
	it('should have new user in dashboard', function() {
		
		loginEmail.sendKeys('psd@psd.com');
		loginPassword.sendKeys('ilovenick');
		//sign in button
		element(by.css('#signin-button')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));

	});

//psd@psd.com
});

