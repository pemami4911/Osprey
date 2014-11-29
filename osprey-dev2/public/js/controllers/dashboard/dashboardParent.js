'use strict';

angular.module('dashboardParentModule', ['splashPageService'])

	.controller('dashboardParentController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
	function($scope, $http, $location, splashFactory) {
		
		$scope.children = {};
		splashFactory.getChildrenOfParent($scope.loggedUser.user_id)
			.success(function(data) {
				$scope.children = data;
			}).error(function(response) {
				$scope.error = response.message; 
				$location.path('/');
			});
		
		$scope.getChildren = function() {
			console.log($scope.children);
		}
	}]);

