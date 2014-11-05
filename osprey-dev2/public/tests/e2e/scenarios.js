'use strict';

describe('ospreyCoreApp', function() {

	browser.get('http://localhost:8080');

	var loginEmail = element(by.model('loginData.email'));
	var loginPassword = element(by.model('loginData.password'));
	var regEmail = element(by.model('initRegData.email'));
	var logout = element(by.css('#logout-button'));

	var alertMsg = element(by.binding('alert.msg'));

	var tab1 = element(by.css('.tab1'));
	var tab2 = element(by.css('.tab2'));
	var tab3 = element(by.css('.tab3'));

	var pageHeader = element(by.css('.page-header'));


	//first e2e test
	it('should have the title', function() {
		expect(browser.getTitle()).toEqual('Osprey');
	}); 

	it('should automatically redirect to / when first opening', function() {
		expect(browser.getLocationAbsUrl()).toMatch('/'); 
	}); 

	it('should prevent a user from navigating to the dashboard without logging in first', function() {
		browser.get('http://localhost:8080/#/dashboard'); 
		expect(browser.getLocationAbsUrl()).toMatch('/'); 
	});

	it('should prevent a user from navigating to /regParent directly, without entering an email', function() {
		browser.get('http://localhost:8080/#/regParent'); 
		expect(browser.getLocationAbsUrl()).toMatch('/'); 
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

	});

		//logout test
	it('should logout and return to splash page', function() {
		logout.click();
		expect(browser.get('http://localhost:8080'));
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

	});

	it('should prohibit user to go back to splash page without logging out', function() {
		browser.navigate().back();
		expect(browser.get('http://localhost:8080/#/dashboard'));
		logout.click();
	});



	//invalid login check
	it('should catch invalid emails and passwords', function() {
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

	it('should prevent the user from returning to the splash page if they haven\'t logged out', function() {
		browser.get('http://localhost:8080/#/'); 
		expect(browser.getLocationAbsUrl()).toMatch('/dashboard'); 
	});

<<<<<<< HEAD
	it('should navigate through tabs smoothly', function() {
		tab1.click();
		expect(pageHeader.getText()).toEqual('My Patients');
		tab2.click();
		expect(pageHeader.getText()).toEqual('Reports');
		tab3.click();
		expect(pageHeader.getText()).toEqual('Settings');
	});

	
	it('should allow user to change email', function() {
		element(by.css('#recom')).click();
		element(by.css('#custom')).click();
		element(by.css('#accSettings')).click();
		/*
		element(by.css('#chEmail')).click();
		element(by.model('newAccountSettings.newEmail')).sendKeys('psd@parent.com');
		element(by.css('#submitNewEmail')).click();

		logout.click();
		loginEmail.sendKeys('psd@parent.com');
		loginPassword.sendKeys('ilovenick');
		//sign in button
		element(by.css('#signin-button')).click();
		expect(browser.get('http://localhost:8080/#/dashboard'));
		
		//element(by.model('newAccountSettings.newPassword')).sendKeys('ionlylikenick');
		//element(by.css('#submitNewPword')).click();

		
	});
	
	// the first thing a physician should see is a table of their patients
	it('should allow the user to click on a patients name to navigate to their personal info page', function() {
		element(by.css('')).click(); 
	}); 

	it('should logout and return to splash page', function() {
		element(by.css('#logout-button')).click();
		expect(browser.get('http://localhost:8080/#/'));
	});

*/


});

