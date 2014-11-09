describe('dashboardPatientsController', function(){

  beforeEach(module('dashboardSettingsModule')); 

   var ctrl, scope,
    $httpBackend, 
    $location, userResponse;
   // inject the $controller and $rootScope services
   // in the beforeEach block
   beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
       // Create a new scope that's a child of the $rootScope
       scope = $rootScope.$new();
       dashSettingsCtrl = $controller('dashboardSettingsController', {
        $scope : scope
      });

       //establish parent controller
       userResponse = { "userType": "Physician", "email": "asd@asd.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
       scope.loggedUser = userResponse;
       scope.checkLogged = function() {
          scope.loggedUser = userResponse;
       }

       $httpBackend = _$httpBackend_; 
       
       $httpBackend.when('POST', '/auth/changeEmail').respond(200, 1);
       $httpBackend.when('POST', '/auth/changeTableSettings').respond(200, 1);
       
       $location = _$location_; 

    }));

   it('should be able to instantiate a copy of the dashboardController', function() {
      expect(dashSettingsCtrl).toExist; 
   });

   it('should have access to the dashboardControllers scope', function() {
      expect(scope.passwordCollapsed).toExist; 
   });

   it('should fail to allow the user to customize the columns of the table with when no table settings are provided', function() {

      scope.changeTableSettings(); 

      $httpBackend.expect('POST', '/auth/changeTableSettings').respond(400, {
        'message': 'No settings were provided'
      }); 

      $httpBackend.flush(); 
      expect(scope.error).toEqual('No settings were provided'); 
    });

   it('should allow the user to customize the columns of the table with scope.changeTableSettings()', function() {
      scope.newTableSettings = {age: true, email:false, weight:true};
      userResponse = {"email": "a@a.com", "tableSettings": {"showAge": true, "showWeight": true, "showEmail": false}};
      scope.changeTableSettings();
      $httpBackend.flush();
      expect(scope.loggedUser.tableSettings.showEmail).toBe(false);
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

   it('should send the user\'s new email an email when the old email has been changed', function () {

   });

 }); 
