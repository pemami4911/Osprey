'use strict';
angular.module('dashboardPageModule', ['splashPageService'])

	
	// inject the Todo service factory into our controller
	.controller('dashboardController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.activeTab = 1;
		$scope.contentUrl = 'views/dashPartials/dashMain.html';
		$scope.switchTab = function( pageNumber ) {
			$scope.activeTab = pageNumber;
			if ($scope.activeTab == 1) {
				$scope.contentUrl = 'views/dashPartials/dashMain.html';
			} else if ($scope.activeTab == 2) {
				$scope.contentUrl = 'views/dashPartials/dashCharts.html';
			} else {
				$scope.contentUrl = '';
			}
		}
		$scope.isActive = function( pageNumber ) {
			return pageNumber === $scope.activeTab;
		}

	}]);

