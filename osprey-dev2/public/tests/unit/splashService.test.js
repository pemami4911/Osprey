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

    // ADD TESTS HERE
 }); 
