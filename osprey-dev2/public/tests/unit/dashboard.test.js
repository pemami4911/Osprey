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

   it('should successfully be able to log out a user', function() {
      expect($location.url()).toBe('/'); 
   });

   it('should kick a user out of the dashboard if the controller is loaded and no one is logged in', function() {
      expect($location.url()).toBe('/'); 
   });

   it('should allow the user to customize the columns of the table with scope.changeTableSettings()', function() {

   });

   it('should populate the tables with an http.GET request to our dummy backend', function() {

   });

   it('should allow the user to successfully change their email', function() {

   });

   it('should allow the user to change their password', function () {

   });

   it('should send the user an email to notify them when their password has changed', function() {

   });

   it('should send the user\'s new email and email when the old email has been changed', function () {

   });

   it('should be fail to log out if scope.loggedUser is empty', function() {

      scope.loggedUser = {}; 

      $httpBackend.expect('GET', '/auth/logout');

      scope.logoutAttempt(scope.loggedUser); 

      expect(scope.error).toBe("Failed call to logoutAttempt()"); 
   });

   it('should change the content url when a new tab is selected, and should be able to switch back', function() {

      scope.activeTab = 1;
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
      scope.switchTab(2);
      expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
      scope.switchTab(1);
      expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 

   }); 

   it('should change the content url to any other url', function() {

      scope.switchTab(3);  
          expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
      scope.switchTab(1);
          expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
      scope.switchTab(2); 
          expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
   });

   it('should not allow a route change to complete unless the user has logged out', function() {

   });



 }); 
