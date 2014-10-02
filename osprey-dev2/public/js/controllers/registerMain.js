'use strict';
angular.module('regPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regController', ['$scope','$http', 'splashFactory', function($scope, $http, splashFactory) {
		$scope.regData = {};
		$scope.regData.email = splashFactory.get();
		$scope.loading = true;

		$scope.registerFinal = function() {
			$scope.loading = true;

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.regData.email != undefined) {

				// call the create function from our service (returns a promise object)
				splashFactory.registerFinal($scope.regData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						console.log(data);
						window.alert("User created");
					});
			}
		};
	}]);