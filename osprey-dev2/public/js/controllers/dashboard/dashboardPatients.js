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
            // if ($scope.loggedUser.tableSettings != undefined) {
            //console.log($scope.loggedUser);
	   			if ($scope.loggedUser.phyShowEmail) {
	        		$scope.grid.columnDefs.push({field: "email", displayName: "E-mail Address"});
	        	}

	        	if ($scope.loggedUser.phyShowWeight) {
	        		$scope.grid.columnDefs.push({field: "weight", displayName: "Weight"});
	        	}

	        	if ($scope.loggedUser.phyShowAge) {
	        		$scope.grid.columnDefs.push({field: "age", displayName: "Age"});
	        	}
	        // }
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

	        $scope.tableData = [];

	        var content = $scope.loggedUser.children.content;

    		for (var i = 0; i < content.length; i++) {
    			var months = parseInt(content[i].birthday.substr(5, 2)) + 1;
    			var birthday = new Date(content[i].birthday.substr(0, 4), 
    									months, 
    									content[i].birthday.substr(8, 2), 
    									0, 0, 0, 0);

				$scope.tableData.push({	
					"patientName" : content[i].name,
				 	"parentName" : content[i].parent.firstName + " " + content[i].parent.lastName ,
				 	"email" : content[i].parent.username,
				 	"weight" : Math.random(),
				 	"age" : calculateAge(birthday)
				})
			}

        	$scope.grid.data = $scope.tableData;

	        $scope.updateColumns();
	    }

   		reloadGrid();

   		function calculateAge (birthDate) {
		    birthDate = new Date(birthDate);
		    var otherDate = new Date()

		    var years = (otherDate.getFullYear() - birthDate.getFullYear());

		    if (otherDate.getMonth() < birthDate.getMonth() || 
		        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
		        years--;
		    }

		    return years;
		}

	}]);

