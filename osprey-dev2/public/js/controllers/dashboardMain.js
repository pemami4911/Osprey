'use strict';

angular.module('dashboardPageModule', ['splashPageService', 'ngReactGrid'])

	// inject the Todo service factory into our controller
	.controller('dashboardController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
										'ngReactGridCheckbox', 
	function($scope, $http, $location, splashFactory, ngReactGridCheckbox) {
		$scope.activeTab = 1;
		$scope.contentUrl = 'views/dashPartials/dashMain.html';
		$scope.loggedUser = {};

		$scope.tableSelections = [];
		$scope.tableData = [
			{	
				"patientName" : "John Smith",
			 	"parentName" : "Eric Smith",
			 	"email" : "john@yahoo.com",
			 	"weight" : 110,
			 	"age" : 7
			},
			{	
				"patientName" : "Jane Smith",
			 	"parentName" : "abc def",
			 	"email" : "test@yahoo.com",
			 	"weight" : 123,
			 	"age" : 6
			},
			{	
				"patientName" : "das asda",
			 	"parentName" : "sdf sdfs",
			 	"email" : "as@yahoo.com",
			 	"weight" : 80,
			 	"age" : 5
			}
		];

		for (var i = 1; i <= 100; i++) {
			$scope.tableData.push({	
				"patientName" : "Patient " + i,
			 	"parentName" : "Parent " + i,
			 	"email" : "test@email.com" + i,
			 	"weight" : i,
			 	"age" : i * 2
			})
		}
        
        $scope.grid = {
                data: $scope.tableData,
                columnDefs: [
                new ngReactGridCheckbox($scope.tableSelections),
                {
                    field: "patientName",
                    displayName: "Patient Name",
                    render: function(row) {
                      return React.DOM.a({href:"javascript:", onClick: function() {
                          console.log(row);
                      }}, row.patientName);
                  	}
                },
                {
                    field: "parentName",
                    displayName: "Parent Name"
                },
                {
                    field: "email",
                    displayName: "E-mail Address"
                },
                {
                    field: "weight",
                    displayName: "Weight"
                },
                {
                    field: "age",
                    displayName: "Age"
                }]
        };


		splashFactory.isLoggedIn()
			// if successful creation, call our get function to get all the new todos
			.success(function(data) {
				console.log(data);
				if (data == 'false') {
					window.alert("Please log in first!");
					$location.path('/');
				} else {
					$scope.loggedUser = data;
				}
			}).error(function(response) {
				console.log(response);
				$scope.error = response.message; 
			});


		$scope.switchTab = function( pageNumber ) {
			$scope.activeTab = pageNumber;
			if ($scope.activeTab == 1) {
				$scope.contentUrl = 'views/dashPartials/dashMain.html';
			} else if ($scope.activeTab == 2) {
				$scope.contentUrl = 'views/dashPartials/dashTables.html';
			} else if ($scope.activeTab == 3) {
				$scope.contentUrl = 'views/dashPartials/dashCharts.html';
			}
		}
		$scope.isActive = function( pageNumber ) {
			return pageNumber === $scope.activeTab;
		}

	}]);

