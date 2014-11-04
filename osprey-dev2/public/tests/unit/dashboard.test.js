describe('dashboardControllerLoggedIn', function(){

  beforeEach(module('dashboardPageModule')); 

   var ctrl, scope,
    $httpBackend, 
    $location, userResponse;
   // inject the $controller and $rootScope services
   // in the beforeEach block
   beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
       // Create a new scope that's a child of the $rootScope
       scope = $rootScope.$new();
       
      // Create the controller
       dashCtrl = $controller('dashboardController', {
        $scope : scope
      });
       userResponse = { "email": "asd@asd.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
       $httpBackend = _$httpBackend_; 
       $httpBackend.when('POST', '/auth/isLogged').respond( function() {
            return [200, userResponse];
          }
        ); 
       $httpBackend.when('GET', '../json/users.json').respond(200, {});
       $httpBackend.when('POST', '/auth/changeEmail').respond(200, 1);
       $httpBackend.when('POST', '/auth/changeTableSettings').respond(200, 1);
       $httpBackend.flush();
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
      $httpBackend.when('GET', '/auth/logout').respond("Logged out successfully"); 
      
      scope.logoutAttempt(); 
      $httpBackend.flush();

      expect($location.url()).toBe('/'); 
   });

   it('should allow the user to customize the columns of the table with scope.changeTableSettings()', function() {
      scope.newTableSettings = {age: true, email:false, weight:true};
      scope.changeTableSettings();
      userResponse = {"email": "a@a.com", "tableSettings": {"showAge": true, "showWeight": true, "showEmail": false}};
      $httpBackend.flush();
      expect(scope.loggedUser.tableSettings.showEmail).toBe(false);
   });

   it('should populate the tables with an http.GET request to our dummy backend', function() {

   });

   it('should allow the user to successfully change their email', function() {
      scope.newAccountSettings.newEmail = "a@a.com";
      scope.changeEmail();
      userResponse = {"email": "a@a.com"};
      $httpBackend.flush();
      expect(scope.loggedUser.email).toBe("a@a.com");
   });

   it('should allow the user to change their password', function () {

   });

   it('should send the user an email to notify them when their password has changed', function() {

   });

   it('should send the user\'s new email and email when the old email has been changed', function () {

   });

   it('should be fail to log out if scope.loggedUser is empty', function() {

      scope.loggedUser = undefined; 
      scope.logoutAttempt(scope.loggedUser); 
      expect(scope.error).toBe("Failed call to logoutAttempt()"); 
   });

   it('should change the content url when a new tab is selected, and should be able to switch back', function() {

      scope.activeTab = 2;
      expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
      scope.switchTab(3);
      expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
      scope.switchTab(2);
      expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 

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

describe('dashboardControllerNotLoggedIn', function(){

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
       $httpBackend.when('POST', '/auth/isLogged').respond(false); 
       $location = _$location_; 
    }));

    it('should kick a user out of the dashboard if the controller is loaded and no one is logged in', function() {
      $httpBackend.when('POST', '/auth/isLogged').respond(false);
      $httpBackend.flush();
      expect($location.url()).toBe('/'); 
   });

 });
