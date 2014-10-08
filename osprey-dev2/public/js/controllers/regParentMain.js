'use strict';
angular.module('regParentPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regParentController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.regData = {};
		$scope.regData.email = splashFactory.get('e-mail');
		$scope.regData.userType = splashFactory.get('userType'); 
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
					}).error(function(response) {
						$scope.error = response.message;
					});
			}
		};
	}]);