'use strict';

angular.module('dashboardPatientsModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

	.controller('dashboardPatientsController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
										'ngReactGridCheckbox',
	function($scope, $http, $location, splashFactory, ngReactGridCheckbox) {
		$scope.tableSelections = [];

		$scope.updateColumns = function() {
            if ($scope.loggedUser.tableSettings != undefined) {
	   			if ($scope.loggedUser.tableSettings.showEmail) {
	        		$scope.grid.columnDefs.push({field: "email", displayName: "E-mail Address"});
	        	}

	        	if ($scope.loggedUser.tableSettings.showWeight) {
	        		$scope.grid.columnDefs.push({field: "weight", displayName: "Weight"});
	        	}

	        	if ($scope.loggedUser.tableSettings.showAge) {
	        		$scope.grid.columnDefs.push({field: "age", displayName: "Age"});
	        	}
	        }
   		}

		var reloadGrid = function() {
			var clone = function(recip, elem) {
				var newObj = {};
				for (var property in elem) {
					recip[property] = elem[property];
				}
				return newObj;
			}
			$scope.grid = {
	            data: [],
	            columnDefs: [
	            	new ngReactGridCheckbox($scope.tableSelections),
	                {
	                    field: "patientName",
	                    displayName: "Patient Name",
	                    render: function(row) {
	                      return React.DOM.a({href:"javascript:", onClick: function() {
	                      		clone($scope.selectedRow, row);
	                      		$scope.switchTab(5);
	                      }}, row.patientName);
	                  	}
	                },
	                {
	                    field: "parentName",
	                    displayName: "Parent Name"
	                }],
	            localMode: true,
	        };

	        $http.get('../json/users.json').success(function(data) {
			    		$scope.tableData = data;

			    		for (var i = 1; i <= 100; i++) {
							$scope.tableData.push({	
								"patientName" : "Patient " + i,
							 	"parentName" : "Parent " + i,
							 	"email" : "test@email.com" + i,
							 	"weight" : i,
							 	"age" : i * 2
							})
						}

			        	$scope.grid.data = $scope.tableData;

			  		});
	        $scope.updateColumns();
	    }

   		reloadGrid();

	}]);

