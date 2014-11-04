'use strict';
angular.module('regParentPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regParentController', ['$scope','$http', '$location', 'splashFactory', function($scope, $http, $location, splashFactory) {
		$scope.regData = {};
		$scope.regData.email = splashFactory.get('e-mail');
		$scope.regData.userType = splashFactory.get('userType'); 
		$scope.loading = false;

		// $scope.$on is an event handler
		// $locationChangeStart is an angular event that is called every time a location change begins
		$scope.$on('$locationChangeStart', function (event, newURL) {
			var msg = "Are you sure you want to navigate away from this page? All input will be lost."; 
			var check = "dashboard"; 

	        if( $scope.loading === false ) {
	        	if( newURL.indexOf(check) != (-1) ) {
	        		event.preventDefault(); 
	        	}
	        	else {
	        		if( !window.confirm(msg) )
	        			event.preventDefault(); 
	        	}
	        }
   		})

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
						if( data != 'null' )
							$location.path('/dashboard');
						else {
							window.alert("Failed to register!"); 
							$scope.loading = false;
						}
					}).error(function(response) {
						$scope.error = response.message;
						$scope.loading = false;
					});
			}
			else
				$scope.loading = false;
		};

		$scope.back = function() {
			$location.path('/');
		};

	}]);
