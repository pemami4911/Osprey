'use strict';
angular.module('regPageController', [])

	// inject the Todo service factory into our controller
	.controller('regController', ['$scope','$http', 'splashFactory', function($scope, $http, splashFactory) {
		$scope.regData = {};
		$scope.regData.email = splashFactory.get();
		$scope.loading = true;

		$scope.login = function() {
			$scope.loading = true;

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.loginData.email != undefined) {

				// call the create function from our service (returns a promise object)
				splashFactory.loginAttempt($scope.loginData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						if(data == "null") {
							console.log("Bad username or password");
							window.alert("Bad username or password");
						}
						else {
							console.log(data);
							window.alert("Successful login");
						}

						$scope.loginData = {}; // clear the form so our user is ready to enter another
						//$scope.todos = data; // assign our new list of todos
					});
			}
		};

		$scope.register = function() {
			$scope.loading = true;

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.initRegData.email != undefined) {

				// call the create function from our service (returns a promise object)
				splashFactory.registerAttempt($scope.initRegData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						console.log(data + " user(s) with that e-mail");
						$splashFactory.set(initRegData.email);
					});
			}
		};
	}]);