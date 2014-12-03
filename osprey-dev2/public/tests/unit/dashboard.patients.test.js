describe('dashboardPatientsController', function(){

  beforeEach(module('dashboardPatientsModule')); 

	var ctrl, scope, $httpBackend, $location, userResponse;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
		// Create a new scope that's a child of the $rootScope
		scope = $rootScope.$new();

		// establish parent controller
		userResponse = 	{ 	"userType": "Physician", "email": "asd@asd.com", "password": "hash", 
							"phyShowAge": true, "phyShowEmail": false, "phyShowWeight": true, 
							"children" : {"content": [
							{"birthday":"2010-01-01", "name": "child a", 
								"parent": {"firstName":"John", "lastName":"Smith", "username": "a@a.com"}
							}
							]}
						};
		scope.loggedUser = userResponse;


		// Create the controller
		dashPatientsCtrl = $controller('dashboardPatientsController', {
		 	$scope : scope
		});

		$httpBackend = _$httpBackend_; 
		$location = _$location_; 
	}));

	it('should be able to instantiate a copy of the dashboardController', function() {
		expect(dashPatientsCtrl).toExist; 
	});

	it('should have access to the dashboardControllers scope', function() {
		expect(scope.tableSelections).toExist; 
	});

	it('should populate the tables with children', function() {
		expect(scope.grid.data.length).toBe(1);
	});
	it('should not display the email column if the user has that setting off', function() {
		expect(scope.grid.columnDefs.length).toBe(5);
	});
 }); 
