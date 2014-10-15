describe('regParentController', function(){

	beforeEach(module('regParentPageModule')); 

	 var ctrl, scope,
	 	$httpBackend, 
	 	$location;
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
    	 // Create a new scope that's a child of the $rootScope
   		 scope = $rootScope.$new();
       
    	// Create the controller
    	 regCtrl = $controller('regParentController', {
     	 	$scope : scope
   	 	});

    	 $httpBackend = _$httpBackend_; 
    	 $location = _$location_; 
  	}));

   it('should be able to create an instance of itself', function() {
      expect(regCtrl).toExist; 
   }); 

   it('should be able to access scope variable data', function() {
      expect(scope.regData).toExist; 
   });

   it('should save the email and usertype of the registrant', function() {

      scope.regData.email = "test@test123.com"; 
      scope.regData.userType = "Parent"; 

      $httpBackend.when('POST', '/auth/register').respond(200); 

      scope.registerFinal();  
      $httpBackend.flush(); 

      expect(scope.regData.email).toBe('test@test123.com'); 
      expect(scope.regData.userType).toBe('Parent'); 
      expect(scope.error).toBe(undefined); 

   }); 

   it('should reject invalid emails', function() {
      scope.regData.email = "test@test;.com"; 

      $httpBackend.when('POST', '/auth/register').respond(400, {
          'message': "Invalid email"
      }); 

      scope.registerFinal(); 
      $httpBackend.flush(); 

      expect(scope.error).toExist; 
      expect(scope.error).toEqual('Invalid email'); 
   });

 }); 
