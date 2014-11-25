'use strict';
angular.module('splashPageModule', ['splashPageService'])

	
	// inject the Todo service factory into our controller
	.controller('splashController', ['$scope','$http', '$location', 'splashFactory', '$cookieStore', function($scope, $http, $location, splashFactory, $cookieStore) {
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
				// call the create function from our service (returns a promise object)
				splashFactory.loginAttempt( $scope.loginData )
					// if successful creation, call our get function to get all the new todos
					.success( function ( userType ) {
						console.log( userType ); 
						$scope.loading = true; 
						if ( userType === "Parent" )
							$location.path('/dashParent');
						else
							$location.path('/dashboard');
					}).error(function(response) {
						console.log( response.message ); 
						$scope.addAlert( response.message, "danger", true)
						$scope.error = response.message;
						$scope.loading = false;
					});		
		}

		$scope.register = function() {

				// call the create function from our service (returns a promise object)
				splashFactory.registerAttempt( $scope.initRegData )
					// if successful creation, call our get function to get all the new todos
					.success( function( data ) {
						$scope.loading = true; 

						$cookieStore.put( 'userType', $scope.initRegData.userType ); 
						$cookieStore.put( $scope.initRegData.userType, $scope.initRegData.email ); 

						if ($scope.initRegData.userType === 'Parent')
							$location.path('/regParent');
						else
							$location.path('/regPhysician');
						
					}).error(function (response) {
						console.log( response.message ); 
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

		$scope.isPhysician = function() {
			return ($scope.initRegData.userType === "Parent") ? false : true; 
		}

	}]);

