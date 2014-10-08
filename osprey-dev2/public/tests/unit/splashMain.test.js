describe('splashController', function(){

	beforeEach(module('splashPageModule')); 

	 var ctrl, scope, 
	 	$httpBackend, 
	 	$location;
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
    	 // Create a new scope that's a child of the $rootScope
   		 scope = $rootScope.$new();

    	// Create the controller
    	 ctrl = $controller('splashController', {
     	 	$scope: scope
   	 	});

    	 $httpBackend = _$httpBackend_; 
    	 $location = _$location_; 
  	}));

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

	it('$scope.register() should succeed with correct data', function() {

		scope.initRegData.email = 'test@test.com';
		$httpBackend.when('POST', '/auth/checkReg').respond(200);

		scope.register();
		$httpBackend.flush();

		// test scope value
		expect(scope.initRegData.email).toBe('test@test.com');
		expect(scope.error).toEqual(undefined);
		expect($location.url()).toBe('/registration');
	});

	it('$scope.register() should fail to register with duplicate email', function() {

		// pretend like test@test.com has already been registered before
		scope.initRegData.email = 'test@test.com'; 
		scope.register(); 

		// Test expected POST request
		$httpBackend.when('POST', '/auth/checkReg').respond(400, {
			'message': 'Username already exists'
		});

		scope.register();
		$httpBackend.flush();

		// Test scope value
		expect(scope.error).toBe('Username already exists');
	});

});