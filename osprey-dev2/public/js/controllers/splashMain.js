'use strict';
angular.module('splashPageModule', ['splashPageService'])

	
	// inject the Todo service factory into our controller
	.controller('splashController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.loginData = {};
		$scope.initRegData = {userType: "Parent"};

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
							$scope.addAlert("Bad username or password!", "danger", true);
						}
						else {
							console.log(data);
							$scope.addAlert("Successful login", "success", true);
						}

						//$scope.loginData = {}; // clear the form so our user is ready to enter another
						//$scope.todos = data; // assign our new list of todos
					}).error(function(response) {
						$scope.error = response.message;
						$scope.loading = false;
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
							$scope.addAlert("E-mail already exists", "danger", false);
						else {
							splashFactory.set($scope.initRegData.email, 'e-mail');
							splashFactory.set($scope.initRegData.userType, 'userType');

							if ($scope.initRegData.userType == 'Parent')
								$location.path('/regParent');
							else
								$location.path('/regPhysician');
						}
					}).error(function(response) {
						$scope.loading = false;
						$scope.error = response.message;
					});
			}
		};

		$scope.loginAlerts = [];
		$scope.regAlerts = [];

		$scope.addAlert = function(message, type, forLogin) {
			if (forLogin) {
				if ($scope.loginAlerts.length > 0)
					$scope.loginAlerts.splice(0, 1);
				$scope.loginAlerts.push({msg: message, type: type});
			} else {
				if ($scope.regAlerts.length > 0)
					$scope.regAlerts.splice(0, 1);
				$scope.regAlerts.push({msg: message, type: type});
			}
		};

		$scope.closeAlert = function(index, forLogin) {
			if (forLogin)
				$scope.loginAlerts.splice(index, 1);
			else
				$scope.regAlerts.splice(index, 1);
		};
	}]);

