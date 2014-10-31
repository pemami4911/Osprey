'use strict';
angular.module('regParentPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regParentController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.regData = {};
		$scope.regData.email = splashFactory.get('e-mail');
		$scope.regData.userType = splashFactory.get('userType'); 
		$scope.loading = false;

		// prevent the user from losing all of their input data if the page is refreshed or if they hit backspace
		$scope.$on('$routeChangeStart', function () {
	        if( $scope.loading === false ) {

	        }
   		});

		$scope.registerFinal = function() {
			$scope.loading = true;

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.regData.email != undefined) {
				// call the create function from our service (returns a promise object)
				splashFactory.registerFinal($scope.regData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						//console.log(data);
						//window.alert("User created");
						$location.path('/dashboard');
					}).error(function(response) {
						$scope.error = response.message;
					});
			}
			$scope.loading = false;
		};
	}]);