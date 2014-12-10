'use strict';

describe('ospreyCoreApp', function() {
//for physician splash to register to verify

	browser.get('http://localhost:8080');

	var loginEmail = element(by.model('loginData.email'));
	var loginPassword = element(by.model('loginData.password'));
	var regEmail = element(by.model('initRegData.email'));
	var logout = element(by.css('#logout-button'));

	var alertMsg = element(by.binding('alert.msg'));
	var patientName = element(by.binding('selectedRow.patientName'));

	var next = element(by.css('#next-button'));
	var tab1 = element(by.repeater('item in navItems').row(0));
	var tab2 = element(by.repeater('item in navItems').row(1));
	var tab3 = element(by.repeater('item in navItems').row(2));

	var pageHeader = element(by.css('.page-header'));
	var panelHeading = element(by.css('.panel-heading'));


	//first e2e test
	it('should have the title', function() {
		expect(browser.getTitle()).toEqual('Osprey');
	}); 

	it('should prevent a user from navigating registration page directly, without entering an email', function() {
		next.click();
		expect(browser.get('http://localhost:8080'));
	});

		//invalid login check
	it('should catch invalid emails and passwords', function() {
		loginEmail.sendKeys('cantwaitforthenbaseasontostart@letsgo.com');
		loginPassword.sendKeys('ilovenickjiang');
		element(by.css('#signin-button')).click();

		expect(alertMsg.getText()).toEqual('Invalid email');
		loginEmail.clear();
		loginPassword.clear();
	});

/*
	it('should show that the physician exists already', function() {
		element(by.css('#physButton')).click();
		regEmail.sendKeys('psdewar2@yahoo.com');
		next.click();
		expect(alertMsg.getText()).toEqual('A user is already registered with this email');
	});


	//valid login and dashboard check for physician
	it('should have new physician in dashboard', function() {
		
		loginEmail.sendKeys('psdewar2@yahoo.com');
		loginPassword.sendKeys('dr');
		//sign in button
		element(by.css('#signin-button')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
	});

	it('should navigate to physician dashboard correctly', function() {
		expect(pageHeader.getText()).toEqual('Patient Hub');
	});

	it('should navigate through tabs smoothly', function() {
		tab2.click();
		expect(pageHeader.getText()).toEqual('Reports');
		tab3.click();
		expect(pageHeader.getText()).toEqual('Admin');
	});

	it('should prohibit user from returning to splash page without logging out', function() {
		browser.navigate().back();
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
	});


	/*
	it('should prevent a user from navigating to the dashboard without logging in first', function() {
		browser.get('http://localhost:8080/#/dashboard'); 
		expect(browser.getLocationAbsUrl()).toMatch('/'); 
	});


	

		//goes to regParent
		regEmail.sendKeys('psdpar@ent.com');

		//next-button
		next.click();

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

	// the first thing a physician should see is a table of their patients
	it('should allow physician to click on a patients name to navigate to their personal info page', function() {
		expect(panelHeading.getText()).toEqual('Patients');
		//element(by.css('')).click(); 
	}); 

	it('should prohibit user from returning to splash page without logging out', function() {
		browser.navigate().back();
		expect(browser.get('http://localhost:8080/#/dashboard'));
		logout.click();
	});

	

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
	});
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

	
	


	it('should automatically redirect to / when first opening', function() {
		expect(browser.getLocationAbsUrl()).toMatch('/'); 
	}); 

	




*/


});

