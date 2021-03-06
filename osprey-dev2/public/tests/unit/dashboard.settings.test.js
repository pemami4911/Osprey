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
 
describe('dashboardSettingsController', function(){

 	beforeEach(module('dashboardSettingsModule')); 

	var ctrl, scope, $httpBackend, $location, userResponse;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
		// Create a new scope that's a child of the $rootScope
		scope = $rootScope.$new();
		

		//establish parent controller
		userResponse = 	{ 	"userType": "Physician", "email": "asd@asd.com", "password": "hash", 
							"phyShowAge": true, "phyShowEmail": false, "phyShowWeight": true, 
							"children" : {"content": [
							{"birthday":"2010-01-01", "name": "child a", 
								"parent": {"firstName":"John", "lastName":"Smith", "username": "a@a.com"},
								"fitbit": [{calories: 324.5683931745589,
											timeActiveNotStrenuous: 9.280397527252777,
											timeActiveStrenuous: 6.117963233962655,
											timeSedentary: 8.601639238784568,
											timestamp: "2014-01-06"}, 
											{calories: 324.5683931745589,
											timeActiveNotStrenuous: 9.280397527252777,
											timeActiveStrenuous: 6.117963233962655,
											timeSedentary: 8.601639238784568,
											timestamp: "2014-01-07"}]
							}
							]}
						};
		scope.loggedUser = userResponse;

		scope.checkLogged = function() {
			scope.loggedUser = userResponse;
		}

		dashSettingsCtrl = $controller('dashboardSettingsController', {
			$scope : scope
		});

		$httpBackend = _$httpBackend_; 
		 
		$httpBackend.when('POST', '/settings/changeTableSettings').respond(200, 1);
	 
		$location = _$location_; 

	}));

	it('should be able to instantiate a copy of the dashboardController', function() {
		expect(dashSettingsCtrl).toExist; 
	});

	it('should have access to the dashboardControllers scope', function() {
		expect(scope.passwordCollapsed).toExist; 
	});

	it('should fail to allow the user to customize the columns of the table with when no table settings are provided', function() {

		scope.changeTableSettings(); 

		$httpBackend.expect('POST', '/settings/changeTableSettings').respond(400, {
		  'message': 'No settings were provided'
		}); 

		$httpBackend.flush(); 
		expect(scope.error).toEqual('No settings were provided'); 
	 });

	it('should allow the user to customize the columns of the table with scope.changeTableSettings()', function() {
		scope.newTableSettings = {age: true, email:false, weight:true};
		userResponse = {"email": "a@a.com", "tableSettings": {"showAge": true, "showWeight": true, "showEmail": false}};
		scope.changeTableSettings();
		$httpBackend.flush();
		expect(scope.loggedUser.tableSettings.showEmail).toBe(false);
	});

	it('should allow the user to successfully change their email', function() {

		$httpBackend.when('POST', '/auth/checkReg').respond(200, 0); 
		$httpBackend.when('POST', '/settings/changeEmail').respond(200, 1);

		scope.newAccountSettings.changeEmail.email = "newEmail@newEmail.com";
		scope.newAccountSettings.changeEmail.password = "hash"; 
		scope.changeEmail();
		userResponse = {"email": "newEmail@newEmail.com"};
		$httpBackend.flush();
		expect(scope.loggedUser.email).toBe("newEmail@newEmail.com");
	});

	it('should prevent a user from changing their email if they provide an email already in use', function() {

		$httpBackend.when('POST', '/auth/checkReg').respond(200, 1); 
		$httpBackend.when('POST', '/settings/changeEmail').respond(200, "err1"); 
		
		scope.newAccountSettings.changeEmail.password = "hash"; 
		scope.newAccountSettings.changeEmail.email = "asd@asd.com"; 
		scope.changeEmail(); 
		userResponse = {"email": "asd@asd.com"}; 
		$httpBackend.flush(); 
		expect(scope.loggedUser.email).toBe("asd@asd.com"); 
	});

	it('should prevent a user from changing their email if they provide an incorrect password', function() {

		$httpBackend.when('POST', '/auth/checkReg').respond(200, 0); 
		$httpBackend.when('POST', '/settings/changeEmail').respond(401, {"message": "User verification error"}); 

		scope.newAccountSettings.changeEmail.email = "a@a.com";
		scope.newAccountSettings.changeEmail.password = " "; 
		scope.changeEmail();
		$httpBackend.flush();
		expect(scope.loggedUser.email).toBe("asd@asd.com");
	}); 

	it('should allow the user to change their password', function () {

		$httpBackend.when('POST', '/settings/changePassword').respond(200); 
		scope.newAccountSettings.changePassword.currentPassword = "hash"; 
		scope.newAccountSettings.changePassword.newPassword = "hash2"; 
		scope.changePassword(); 
		userResponse = 	{ 	"userType": "Physician", "email": "asd@asd.com", "password": "hash2" }
		$httpBackend.flush(); 
		expect(scope.loggedUser.password).toBe("hash2"); 

	});

	it('should allow a user to add a child', function() {

		$httpBackend.when('POST', '/settings/changePassword').respond(401, {"message": "User verification error"}); 
		scope.newAccountSettings.changePassword.currentPassword = ""; 
		scope.newAccountSettings.changePassword.newPassword = "hackerzRus"; 
		scope.changePassword(); 
		userResponse = {"password": "hackerzRus"};
		$httpBackend.flush(); 
		expect(scope.loggedUser.password).toBe("hash"); 
	}); 

}); 
