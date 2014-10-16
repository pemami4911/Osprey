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
    	 dashCtrl = $controller('dashboardController', {
     	 	$scope : scope
   	 	});

    	 $httpBackend = _$httpBackend_; 
    	 $location = _$location_; 
  	}));

   it('should be able to instantiate a copy of the dashboardController', function() {
      expect(dashCtrl).toExist; 
   });

   it('should have access to the dashboardControllers scope', function() {
      expect(scope.activeTab).toExist; 
      expect(scope.tableData).toExist; 
   });

   it('should check the page number is active', function() {
      expect(scope.isActive).toBeTruthy(); 
   });

   it('should be able to initiate log out', function() {

      scope.loggedUser = {}; 

      $httpBackend.expect('GET', '/auth/logout');

      scope.logoutAttempt(scope.loggedUser); 
      $httpBackend.flush(); 

      expect(scope.error).toBe("Failed call to logoutAttempt()"); 
   });

   it('should change the content url when a new tab is selected, and should be able to switch back', function() {

      scope.activeTab = 1;
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
      scope.switchTab(2);
      expect(scope.contentUrl).toBe('views/dashPartials/dashTables.html'); 
      scope.switchTab(1);
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 

   }); 

   it('should change the content url to any other url', function() {

      scope.switchTab(3);  
          expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
      scope.switchTab(1);
          expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
      scope.switchTab(2); 
          expect(scope.contentUrl).toBe('views/dashPartials/dashTables.html'); 
   });


 }); 
