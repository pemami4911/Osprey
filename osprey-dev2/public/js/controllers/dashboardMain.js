'use strict';
angular.module('dashboardPageModule', ['splashPageService'])

	

	// inject the Todo service factory into our controller
	.controller('dashboardController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.activeTab = 1;
		$scope.contentUrl = 'views/dashPartials/dashMain.html';
		$scope.loggedUser = {};
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

