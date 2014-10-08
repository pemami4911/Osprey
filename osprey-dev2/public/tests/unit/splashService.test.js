describe('splashPage service', function(){

	beforeEach(module('splashPageService')); 

	 var splashFactory,
	 	$httpBackend; 
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function(_splashFactory_, _$httpBackend_) {
      
      splashFactory = _splashFactory_; 

    	 $httpBackend = _$httpBackend_; 
  	}));

   // test the getters and setters 
   it('should be able to save and retrieve the e-mail and userType of the registrant', function() {

        splashFactory.set('test@test123.com', 'e-mail'); 
        splashFactory.set('Physician', 'userType');

        expect(splashFactory.get('e-mail')).toBe('test@test123.com'); 
        expect(splashFactory.get('userType')).toBe('Physician'); 
   }); 
 }); 
