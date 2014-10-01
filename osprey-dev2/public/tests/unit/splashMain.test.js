describe('splashPageController', function(){

	beforeEach( module('OspreyCoreApp') ); 

	it('should successfully save the email and password', inject(function(_$httpBackend_, $rootScope, $controller) {

		var scope = $rootScope.$new(); 

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