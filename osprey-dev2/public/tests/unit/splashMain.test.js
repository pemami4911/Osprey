describe('splashController', function(){

	beforeEach( module('splashPageModule') ); 

	 var ctrl, scope;
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function($controller, $rootScope) {
    	 // Create a new scope that's a child of the $rootScope
   		 scope = $rootScope.$new();

    	// Create the controller
    	 ctrl = $controller('splashController', {
     	 	$scope: scope
   	 	});
  	}));

	it('should successfully save the email and password', inject(function($httpBackend, $rootScope, $controller) {

		scope.loginData.email = 'test@a.com'; 
		scope.loginData.password = '12345'; 

		$httpBackend.when('POST', '/auth/login').respond(200);

		scope.login(); 	
		$httpBackend.flush();

	  	
		// Test scope value
		expect(scope.loginData.email).toBe('test@a.com');
		expect(scope.loginData.password).toBe('12345'); 
	}));

});