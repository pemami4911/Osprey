'use strict';
angular.module('splashPageModule', [])

	
	// inject the Todo service factory into our controller
	.controller('splashController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.loginData = {};
		$scope.initRegData = {};

		$scope.login = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.loginData.email != undefined) {

				// call the create function from our service (returns a promise object)
				splashFactory.loginAttempt($scope.loginData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
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
			if ($scope.initRegData.email != undefined) {

				// call the create function from our service (returns a promise object)
				splashFactory.registerAttempt($scope.initRegData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						console.log(data + " user(s) with that e-mail");
						if (data >= 1)
							window.alert("E-mail already exists");
						else {
							splashFactory.set($scope.initRegData.email);
							$location.path('/registration');
						}
					});
			}
		};
	}]);

