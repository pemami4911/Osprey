'use strict';

angular.module('dashboardPageModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

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
		$scope.isLogged = false;


		$scope.checkLogged = function() {
			splashFactory.isLoggedIn()
			// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					//console.log(data);
					if (data == 'false') {

						window.alert("Please log in first!");
						$scope.isLogged = false; 
						$location.path('/');
					} else {
						$scope.loggedUser = data;
						$scope.isLogged = true; 
					}
				}).error(function(response) {
					console.log(response);
					$scope.error = response.message; 
				});
		};
		$scope.checkLogged();

		// $scope.$on is an event handler
		// $routeChangeStart is an angular event that is called every time a route change begins
		$scope.$on('$routeChangeStart', function () {
	        var userAuthenticated = function() {  	
         		if( $scope.isLogged )
         			$location.path('/dashboard'); 
         		else
         			$location.path('/');
	         }
	        userAuthenticated(); 
   		});

   		$scope.updateColumns = function() {
   			$scope.grid.columnDefs = [
   				new ngReactGridCheckbox($scope.tableSelections),
                {
                    field: "patientName",
                    displayName: "Patient Name",
                    render: function(row) {
                      return React.DOM.a({href:"javascript:", onClick: function() {
                      		$scope.switchTab(5);
                        	console.log(row);
                      }}, row.patientName);
                  	}
                },
                {
                    field: "parentName",
                    displayName: "Parent Name"
                }
            ];
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
   		
		// Grab dummy data here
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

        	$scope.grid = {
                data: $scope.tableData,
                columnDefs: [
                ]
        	};

        	$scope.updateColumns();
        	// console.log($scope.loggedUser);
        	
  		});
		
		

		$scope.switchTab = function( pageNumber ) {
			$scope.activeTab = pageNumber;
			if ($scope.activeTab == 1) {
				$scope.contentUrl = 'views/dashPartials/dashMain.html';
			} else if ($scope.activeTab == 2) {
				$scope.contentUrl = 'views/dashPartials/dashTables.html';
			} else if ($scope.activeTab == 3) {
				$scope.contentUrl = 'views/dashPartials/dashCharts.html';
			} else if ($scope.activeTab == 4) {
				$scope.contentUrl = 'views/dashPartials/dashSettings.html';
			} else if ($scope.activeTab == 5) {
				$scope.contentUrl = 'views/dashPartials/dashPatient.html';
			}
		}
		$scope.isActive = function( pageNumber ) {
			return pageNumber === $scope.activeTab;
		}

		$scope.logoutAttempt = function() {
			$scope.loading = true;

			// check if someone is currently logged in 
			if( $scope.loggedUser != undefined ) {
				// call the factory service function logoutAttempt
				splashFactory.logoutAttempt($scope.loggedUser) 
					// on successful logout
					.success(function(data){
						$scope.loading = false; 
						if( data === "Logged out successfully") {
							$location.path('/'); 
						}
					}).error(function(response) {
						$scope.error = response.message; 
					});
			}
			else
				$scope.error = "Failed call to logoutAttempt()"; 
		}

		// CODE FOR SETTINGS PAGE:

		// Toggles for Account Settings
		$scope.passwordCollapsed = true;
		$scope.emailCollapsed = true;

		$scope.newAccountSettings = {};
		$scope.newTableSettings = {};

		$scope.changeEmail = function() {
			splashFactory.changeEmail( $scope.loggedUser, $scope.newAccountSettings.newEmail )
				.success(function (data) {
					console.log(data);
					if (data == 1) {
						$scope.checkLogged();
						window.alert("You have successfully changed your e-mail!");
					}
				}).error(function (response){
					console.log(response);
				});
		};

		$scope.changePassword = function() {
			splashFactory.changePassword( $scope.loggedUser, $scope.newAccountSettings.newPassword )
				.success(function (data) {
					console.log(data);
					if (data == 1) {
						$scope.checkLogged();
						window.alert("You have successfully changed your password!");
					}
				}).error(function (response){
					console.log(response);
				});
		}

		$scope.changeTableSettings = function() {
			splashFactory.changeTableSettings( $scope.loggedUser, $scope.newTableSettings )
				.success(function (data) {
					console.log(data);
					$scope.updateColumns();
					if (data == 1) {
						
						window.alert("You have successfully changed your table settings!");
					}
				}).error(function (response){
					console.log(response);
				});
		}


	}]);

