describe('dashboardMyPatientController', function(){

  beforeEach(module('dashboardMyPatientModule')); 

   var ctrl, scope,
    $httpBackend, 
    $location, userResponse;
   // inject the $controller and $rootScope services
   // in the beforeEach block
   beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
       // Create a new scope that's a child of the $rootScope
       scope = $rootScope.$new();

       // establish parent controller
       userResponse = { "userType": "Physician", "email": "asd@asd.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
       scope.loggedUser = userResponse;

      // Create the controller
       dashPatientsCtrl = $controller('dashboardMyPatientController', {
        $scope : scope
      });

       $httpBackend = _$httpBackend_; 
       $location = _$location_; 
    }));

   it('should be able to instantiate a copy of the dashboardController', function() {
      expect(dashPatientsCtrl).toExist; 
   });

   it('should have access to the dashboardControllers scope', function() {
      expect(scope.exampleData).toExist; 
   });

    it('should populate the pdf with the selected patients data', function() {
    var row = {
      'patientName':'Mike', 
      'parentName':'Judy', 
      'email':'test@test.com', 
      'age':20, 
      'weight':120
    };

    scope.selectedRow = row; 

    var doc = new jsPDF(); 

    doc.text(20,20, scope.selectedRow.patientName); 
    doc.text(20,30, scope.selectedRow.parentName); 
    doc.text(20,40, scope.selectedRow.email ); 
    doc.text(20,50, String(scope.selectedRow.age)); 
    doc.text(20,60, String(scope.selectedRow.weight));  

   });
 }); 
