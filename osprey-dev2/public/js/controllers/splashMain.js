'use strict';
angular.module('splashPageModule', ['splashPageService'])

	
	// inject the Todo service factory into our controller
	.controller('splashController', ['$scope','$http', '$location', 'splashFactory', '$cookieStore', function($scope, $http, $location, splashFactory, $cookieStore) {
		$scope.loginData = {};
		$scope.initRegData = {userType: "Parent"};
		$scope.loading = false; 
		$scope.clearUserData; 
		$scope.guessWhoForgotTheirPassword = {}; 

		// $scope.$on is an event handler
		// $locationChangeStart is an angular event that is called every time a route change begins
		$scope.$on('$locationChangeStart', function (event, newURL) {
			var url = "forgotPassword"; 
			var url2 = "/";

	        if( $scope.loading === false && newURL.indexOf(url) === -1 && newURL.indexOf(url2) === -1)
	        	event.preventDefault();
   		})

		$scope.login = function() {
			// call the create function from our service (returns a promise object)
			splashFactory.loginAttempt( $scope.loginData )
				// if successful creation, call our get function to get all the new todos
				.success( function () {
					$scope.loading = true; 
					$location.path('/dashboard');
				}).error(function (response) {
					$scope.addAlert( response.message, "danger", true)
					$scope.error = response.message;
					$scope.loading = false;
				});		
		}

		$scope.register = function() {
			// call the create function from our service (returns a promise object)
			splashFactory.registerAttempt( $scope.initRegData )
				// if successful creation, call our get function to get all the new todos
				.success( function( physData ) {
					$scope.loading = true; 

					$cookieStore.put( 'userType', $scope.initRegData.userType ); 
					$cookieStore.put( $scope.initRegData.userType, $scope.initRegData.email ); 
					
					if ($scope.initRegData.userType === 'Parent') {
						$cookieStore.put( $scope.initRegData.email, physData.id);
						$cookieStore.put( physData.id, physData.name ); 		
						$location.path('/regParent');
					}
					else
						$location.path('/regPhysician');
					
				}).error(function (response) {
					$scope.addAlert( response.message, "danger", false); 
					$scope.error = response.message;
					$scope.loading = false;
				});
		}

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

		$scope.clearUser = function() {
			splashFactory.clearUser( $scope.clearUserData )
				.success( function() {
					window.alert("successfully deleted user "+ $scope.clearUserData); 
				}).error( function (response ) {
					window.alert( response.message ); 
				});
		}

		$scope.isPhysician = function() {
			if( $scope.initRegData.userType === "Parent")
				return false; 
			else {
				$scope.initRegData.inviteCode = ''; 
				return true; 
			}
		}

		$scope.forgotPassword = function() {
			splashFactory.forgotPassword( $scope.guessWhoForgotTheirPassword )
				.success( function ( response ) {
					$scope.addAlert( response.message, "success", false); 
				})
				.error( function ( response ) {
					$scope.addAlert( response.message, "danger", false);  
					$scope.error = response.message; 
				});	
		}

	}]);

