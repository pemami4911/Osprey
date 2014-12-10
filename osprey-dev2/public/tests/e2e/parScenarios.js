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
/*
	it('should show that the parent needs the invite code', function() {
		element(by.css('#parentButton')).click();
		regEmail.sendKeys('psdbballa13@ufl.edu');
		next.click();
		expect(browser.get('http://localhost:8080'));
	});
*/
	//valid login and dashboard check for parent
	it('should have new parent in dashboard', function() {
		
		loginEmail.sendKeys('psdbballa13@ufl.edu');
		loginPassword.sendKeys('pa');
		//sign in button
		element(by.css('#signin-button')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
		expect(pageHeader.getText()).toEqual('Parent Dashboard');
	});

	it('should navigate through tabs smoothly', function() {
		
		tab2.click();
		expect(pageHeader.getText()).toEqual('Admin');
		tab3.click();
		expect(pageHeader.getText()).toEqual('Patient Overview');
	});

});
