'use strict';

angular.module('dashboardPageModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

	// Controls authentication checks, navigation
	.controller('dashboardController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
										'ngReactGridCheckbox', 
	function($scope, $http, $location, splashFactory, ngReactGridCheckbox) {
		$scope.loggedUser = {};
		$scope.loading = false;
		$scope.selectedRow = {};
		$scope.navItems = [];

		$scope.checkLogged = function(callback) {
			splashFactory.isLoggedIn()
				.success( function (data) {
					$scope.loggedUser = data;
					if (callback)
						callback();			
				}).error(function(response) {
					$scope.loading = true;
					$scope.error = response.message; 
					window.alert( $scope.error ); 
					$location.path('/');
				});
			$scope.loading = false; 
		};

		// $scope.$on is an event handler
		// $routeChangeStart is an angular event that is called every time a route change begins
		$scope.$on('$locationChangeStart', function (event) {
	        if( !($scope.loading) ) {
	        	event.preventDefault();
	        }
   		});

		$scope.switchTab = function( pageNumber ) {
			$scope.activeTab = pageNumber;
			if ($scope.loggedUser.userType == 'Parent') {
				if ($scope.activeTab == 1) {
					$scope.contentUrl = 'views/parentPartials/dashParent.html';
				} else if ($scope.activeTab == 2) {
					$scope.contentUrl = 'views/parentPartials/dashSettings.html';
				} else if ($scope.activeTab > 2) {
					var months = parseInt($scope.loggedUser.children.content[$scope.activeTab-3].birthday.substr(5, 2)) + 1;
					var birthday = new Date($scope.loggedUser.children.content[$scope.activeTab-3].birthday.substr(0, 4), 
    									months, 
    									$scope.loggedUser.children.content[$scope.activeTab-3].birthday.substr(8, 2), 
    									0, 0, 0, 0);
					$scope.selectedRow = {	
											"patientName": $scope.loggedUser.children.content[$scope.activeTab-3].name,
										 	"age": calculateAge(birthday),
											"parentName": $scope.loggedUser.firstName + " " + $scope.loggedUser.lastName,
											"email": $scope.loggedUser.username,
											"weight": Math.random()
										 }
					$scope.$broadcast('reloadPatient');
					$scope.contentUrl = 'views/parentPartials/dashPatient.html';
				}  

			}

			if ($scope.loggedUser.userType == 'Physician') {
				if ($scope.activeTab == 2) {
					$scope.contentUrl = 'views/dashPartials/dashMyPatients.html';
				} else if ($scope.activeTab == 3) {
					$scope.contentUrl = 'views/dashPartials/dashCharts.html';
				} else if ($scope.activeTab == 4) {
					$scope.contentUrl = 'views/dashPartials/dashSettings.html';
				} else if ($scope.activeTab == 5) {
					$scope.contentUrl = 'views/dashPartials/dashPatient.html';
				}
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
					.success( function() {				
						$scope.loading = true;
						$scope.loggedUser = null;
						$location.path('/'); 	
					}).error( function (response) {
						console.log( response.message ); 
						$scope.error = response.message; 
					});
				$scope.loading = false;
			}
			else {
				$scope.error = "Attempt to log out failed because no one is logged in!"; 
				console.log( $scope.error ); 
			}
		}

		var init = function() {
			// console.log($scope.loggedUser);
			if ($scope.loggedUser.userType == 'Parent') {
				$scope.navItems.push({name: "Home", num: 1})
				$scope.navItems.push({name: "Admin", num: 2})
				for (var i = 0; i < $scope.loggedUser.children.content.length; i++) {
					$scope.navItems.push({name: $scope.loggedUser.children.content[i].name, num: (i + 3)})
				}
				$scope.switchTab(1);
			} else {
				$scope.switchTab(2);
				$scope.navItems.push({name: "My Patients", num: 2})
				$scope.navItems.push({name: "Reports", num: 3})
				$scope.navItems.push({name: "Admin", num: 4})
			}
		};

		$scope.getChildren = function() {
			if ($scope.loggedUser.userType == 'Physician') {
				splashFactory.getChildrenOfPhysician($scope.loggedUser.user_id)
					.success( function(data) {
						$scope.loggedUser.children = data;
						init();
					});
			} else if ($scope.loggedUser.userType == 'Parent') {
				splashFactory.getChildrenOfParent($scope.loggedUser.user_id)
					.success(function(data) {
						$scope.loggedUser.children = data;
						init();
					}).error(function(response) {
						$scope.error = response.message; 
						$location.path('/');
					});
			}
		}

		$scope.checkLogged($scope.getChildren);

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

