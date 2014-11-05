'use strict';

angular.module('dashboardPageModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('dashboardController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
										'ngReactGridCheckbox', 
	function($scope, $http, $location, splashFactory, ngReactGridCheckbox) {
		$scope.activeTab = 2;
		$scope.contentUrl = 'views/dashPartials/dashMyPatients.html';
		$scope.loggedUser = {};
		$scope.tableSelections = [];
		$scope.loading = false; 
		// Toggles for Account Settings
		$scope.passwordCollapsed = true;
		$scope.emailCollapsed = true;
		$scope.newAccountSettings = {}; 
		$scope.newTableSettings = {}; 

		$scope.checkLogged = function() {
			$scope.loading = true;
			splashFactory.isLoggedIn()
			// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					if ( data === "false" ) {
						$location.path('/');
					} else {
						$scope.loggedUser = data;
						reloadGrid();
					}
				}).error(function(response) {
					//console.log(response);
					$scope.error = response.message; 
					$location.path('/');
				});
			$scope.loading = false; 
		};

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
			$scope.grid = {
	            data: [],
	            columnDefs: [
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
			        	// $scope.updateColumns();
			  		});
	        $scope.updateColumns();
	    }
   		
		$scope.checkLogged();

		// $scope.$on is an event handler
		// $routeChangeStart is an angular event that is called every time a route change begins
		$scope.$on('$locationChangeStart', function (event) {
	        if( !($scope.loading) )
	        	event.preventDefault();
   		});

   	
		$scope.switchTab = function( pageNumber ) {
			$scope.activeTab = pageNumber;
			if ($scope.activeTab == 1) {
				$scope.contentUrl = 'views/dashPartials/dashMain.html';
			} else if ($scope.activeTab == 2) {
				$scope.contentUrl = 'views/dashPartials/dashMyPatients.html';
				reloadGrid();
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
			// check if someone is currently logged in 
			if( $scope.loggedUser != undefined ) {
				// call the factory service function logoutAttempt
				splashFactory.logoutAttempt($scope.loggedUser) 
					// on successful logout
					.success(function(data){
						if( data === "Logged out successfully") {
							$scope.loading = true;
							$scope.loggedUser = null;
							$location.path('/'); 
						}
					}).error(function(response) {
						$scope.error = response.message; 
					});
				$scope.loading = false;
			}
			else
				$scope.error = "Failed call to logoutAttempt()"; 
		}

		// CODE FOR SETTINGS PAGE:
		$scope.changeEmail = function() {
			splashFactory.changeEmail( $scope.loggedUser, $scope.newAccountSettings.newEmail )
				.success(function (data) {
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
					
					if (data == 1) {
						window.alert("You have successfully changed your table settings!");
						$scope.checkLogged();
					}
				}).error(function (response){
					console.log(response);
					scope.error = response.message; 
				});
		}
	}]);

