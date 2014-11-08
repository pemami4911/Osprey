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

		$scope.checkLogged = function(callback) {
			splashFactory.isLoggedIn()
				.success(function(data) {
					if ( data == "false" ) {
						$scope.loading = true;
						$location.path('/');
					} else {
						$scope.loggedUser = data;
						if (callback)
							callback();
						
					}
				}).error(function(response) {
					$scope.error = response.message; 
					$location.path('/');
				});
			$scope.loading = false; 
		};

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

		var init = function() {
			$scope.activeTab = 2;
			$scope.contentUrl = 'views/dashPartials/dashMyPatients.html';
		};
		$scope.checkLogged(init);


	}]);

