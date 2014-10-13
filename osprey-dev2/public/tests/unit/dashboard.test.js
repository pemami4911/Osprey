describe('dashboardController', function(){

	beforeEach(module('dashboardPageModule')); 

	 var ctrl, scope,
	 	$httpBackend, 
	 	$location;
 	 // inject the $controller and $rootScope services
 	 // in the beforeEach block
 	 beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
    	 // Create a new scope that's a child of the $rootScope
   		 scope = $rootScope.$new();
       
    	// Create the controller
    	 regCtrl = $controller('dashboardController', {
     	 	$scope : scope
   	 	});

    	 $httpBackend = _$httpBackend_; 
    	 $location = _$location_; 
  	}));

   it('should change the content url when a new tab is selected', function() {

      scope.activeTab = 1;
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
      scope.switchTab(2);
      expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
      scope.switchTab(1);
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 

   }); 
 }); 
