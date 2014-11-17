describe('dashboardPatientsController', function(){

 	beforeEach(module('dashboardSettingsModule')); 

	var ctrl, scope, $httpBackend, $location, userResponse;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
		// Create a new scope that's a child of the $rootScope
		scope = $rootScope.$new();
		dashSettingsCtrl = $controller('dashboardSettingsController', {
			$scope : scope
		});

		//establish parent controller
		userResponse = { "userType": "Physician", "email": "asd@asd.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
		scope.loggedUser = userResponse;
		scope.checkLogged = function() {
			scope.loggedUser = userResponse;
		}

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
		$httpBackend.when('POST', '/settings/changeEmail').respond(200, "err2"); 

		scope.newAccountSettings.changeEmail.email = "a@a.com";
		scope.newAccountSettings.changeEmail.password = " "; 
		scope.changeEmail();
		userResponse = {"email": "a@a.com"}; 
		$httpBackend.flush();
		expect(scope.loggedUser.email).toBe("asd@asd.com");
	}); 

	it('should allow the user to change their password', function () {

		$httpBackend.when('POST', '/settings/changePassword').respond(200, 1); 
		scope.newAccountSettings.changePassword.currentPassword = "hash"; 
		scope.newAccountSettings.changePassword.newPassword = "hash2"; 
		scope.changePassword(); 
		userResponse = {"password": "hash2"};
		$httpBackend.flush(); 
		expect(scope.loggedUser.password).toBe("hash2"); 

	});

	it('should not allow a user to change their password if they enter an incorrect email', function() {

		$httpBackend.when('POST', '/settings/changePassword').respond(200, "err2"); 
		scope.newAccountSettings.changePassword.currentPassword = ""; 
		scope.newAccountSettings.changePassword.newPassword = "hackerzRus"; 
		scope.changePassword(); 
		userResponse = {"password": "hackerzRus"};
		$httpBackend.flush(); 
		expect(scope.loggedUser.password).toBe("hash"); 
	}); 

}); 
