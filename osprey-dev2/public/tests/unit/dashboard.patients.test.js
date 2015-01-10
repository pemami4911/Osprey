/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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
