/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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
		element(by.css('#parentButton')).click();
		next.click();
		expect(browser.get('http://localhost:8080'));
	}); 
/*
	it('should show that the parent needs the invite code', function() {
		element(by.css('#parentButton')).click();
		regEmail.sendKeys('psdbballa13@ufl.edu');
		next.click();
		expect(browser.get('http://localhost:8080'));
	});

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
*/
});

