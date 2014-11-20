'use strict';
angular.module('splashPageModule', ['splashPageService'])

	
	// inject the Todo service factory into our controller
	.controller('splashController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.loginData = {};
		$scope.initRegData = {userType: "Parent"};
		$scope.loading = false; 

		// $scope.$on is an event handler
		// $locationChangeStart is an angular event that is called every time a route change begins
		$scope.$on('$locationChangeStart', function (event) {
	        if( $scope.loading === false )
	        	event.preventDefault();
   		})

		$scope.login = function() {
			$scope.loading = true;
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.loginData.email != undefined && $scope.loginData.email.trim() != '') {
				// call the create function from our service (returns a promise object)
				splashFactory.loginAttempt($scope.loginData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						if(data == "false") {
							console.log("Invalid email or password");
							$scope.addAlert("Invalid email or password!", "danger", true);
						}
						else if(data == "unconfirmed") {
							$scope.addAlert("Please confirm your email first!", "danger", true); 
						}
						else 
							$location.path('/dashboard');
					}).error(function(response) {
						$scope.error = response.message;
						$scope.loading = false;
					});
			}
			else {
				$scope.error = "Email is undefined";
				$scope.addAlert($scope.error, "danger", true); 
				$scope.loginData.email = null;
				$scope.loading = false;
			}
		};

		$scope.register = function() {
			$scope.loading = true; 
			if ($scope.initRegData.email != undefined && $scope.initRegData.email.trim() != '') {
				// call the create function from our service (returns a promise object)
				splashFactory.registerAttempt($scope.initRegData)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
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
						$scope.error = response.message;
						$scope.loading = false;
					});
			}
			else {
				$scope.error = "Email is undefined"; 
				$scope.addAlert($scope.error, "danger", false); 
				$scope.initRegData.email = {}; 
				$scope.loading = false; 
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

		$scope.test = function() {
			splashFactory.test();
		}
	}]);

