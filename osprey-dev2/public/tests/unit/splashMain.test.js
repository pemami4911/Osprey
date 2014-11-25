describe('splashController', function(){

	beforeEach(module('splashPageModule', 'ngCookies')); 

	 var ctrl, scope, 
	 	$httpBackend, 
	 	$location,
	 	$cookiestore; 
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_, _$cookieStore_) {
    	 // Create a new scope that's a child of the $rootScope
   		 scope = $rootScope.$new();

    	// Create the controller
    	 ctrl = $controller('splashController', {
     	 	$scope: scope
   	 	});

    	 $httpBackend = _$httpBackend_; 
    	 $location = _$location_; 
    	 $cookieStore = _$cookieStore_; 
  	}));

 	it('should be able to create an instance of itself', function() {
 		expect(ctrl).toExist; 
 	})

 	it('should be able to access the scopes variables', function() {
 		expect(scope.loginData).toExist; 
 		expect(scope.initRegData).toExist; 
 	}); 

 	// MOVE TO E2E TEST
 	// it('should not accept an email on login with whitespace', function() {
 	// 	scope.loginData.email = '    '; 
 	// 	scope.login(); 
 	// 	expect(scope.error).toBe(undefined); 
 	// })

	// SHOULD BE E2E TEST
	// it('should not accept an email on initial registration with whitespace', function() {
 // 		scope.initRegData.email = '    '; 
 // 		scope.register(); 
 // 		expect(scope.error).toBe('Email is undefined'); 
 // 	})

	it('should successfully save the email and password on login', function() {

		scope.loginData.email = 'test@a.com'; 
		scope.loginData.password = '12345'; 

		$httpBackend.when('POST','/auth/login').respond(200);

		scope.login(); 	
		$httpBackend.flush();

		// Test scope value
		expect(scope.loginData.email).toBe('test@a.com');
		expect(scope.loginData.password).toBe('12345'); 
	});


	it('$scope.login() should fail to log in with invalid credentials', function() {

		scope.loginData.email = '; rm -rf *'; 
		// Test expected POST request
		$httpBackend.when('POST','/auth/login').respond(400, {
			'message': 'Missing or hostile credentials'
		});

		scope.login();
		$httpBackend.flush();

		// Test scope value
		expect(scope.error).toEqual('Missing or hostile credentials');
	});

	it('$scope.register() should succeed with correct data and redirect to physician page', function() {

		scope.initRegData.email = 'test@test.com';
		scope.initRegData.userType = 'Physician'; 
		$httpBackend.when('POST', '/auth/checkReg').respond(200);

		scope.register();
		$httpBackend.flush();

		// test scope value
		expect(scope.initRegData.email).toBe('test@test.com');
		expect(scope.initRegData.userType).toBe('Physician'); 
		expect(scope.error).toEqual(undefined);
		expect($location.url()).toBe('/regPhysician');
	});

	it('$scope.register() should succeed with correct data and redirect to parent page', function() {

		scope.initRegData.email = 'test@test.com';
		scope.initRegData.userType = 'Parent'; 
		$httpBackend.when('POST', '/auth/checkReg').respond(200);

		scope.register();
		$httpBackend.flush();

		// test scope value
		expect(scope.initRegData.email).toBe('test@test.com');
		expect(scope.initRegData.userType).toBe('Parent'); 
		expect(scope.error).toEqual(undefined);
		expect($location.url()).toBe('/regParent');
	});

	it('$scope.register() should fail to register with duplicate email', function() {

		// pretend like test@test.com has already been registered before
		scope.initRegData.email = 'test@test.com'; 
		scope.register(); 

		// Test expected POST request
		$httpBackend.when('POST', '/auth/checkReg').respond(400, {
			'message': 'Username already exists'
		});

		$httpBackend.flush();

		// Test scope value
		expect(scope.error).toBe('Username already exists');
	});

	it('should save the invite code', function() {

		// assume this is a vali user + invite code
		scope.initRegData.email = 'test@test.com'; 
		scope.initRegData.invCode = 'ai8s9d2fsd2'; 
		scope.register(); 

		$httpBackend.when('POST', '/auth/checkReg'). respond(200); 

		$httpBackend.flush(); 

		expect(scope.initRegData.invCode).toBe('ai8s9d2fsd2'); 
		expect(scope.error).toEqual(undefined); 
	});

	it('should not be able to finish a route change if the user has not legitimately logged in or registered', function() {

	});

});