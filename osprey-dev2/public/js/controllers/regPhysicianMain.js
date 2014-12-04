'use strict';
angular.module('regPhysicianPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regPhysicianController', ['$scope','$http', '$location', 'splashFactory', '$cookieStore', function( $scope, $http, $location, splashFactory, $cookieStore ) {
		$scope.regData = {};
		$scope.regData.userType = $cookieStore.get( 'userType' );  
		$scope.regData.email = $cookieStore.get( $scope.regData.userType );  
		$scope.loading = false;

		$scope.back = function() {
			$location.path('/'); 
		}
		
		// $scope.$on is an event handler
		// $locationChangeStart is an angular event that is called every time a location change begins
		$scope.$on('$locationChangeStart', function (event, newURL) {
			var msg = "Are you sure you want to navigate away from this page? All input will be lost."; 
			var badURL1 = "dashboard";
			var badURL2 = "regParent";

	        if( $scope.loading === false ) {
	        	if( newURL.indexOf(badURL1) != (-1) || newURL.indexOf(badURL2) != (-1) ) {
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
					.success( function() {
						//console.log(data);
						//window.alert("User created");
						$cookieStore.remove('userType'); 
						$cookieStore.remove($scope.regData.userType); 
						$location.path('/verify');
					}).error(function(response) {
						window.alert(response.message);
						$scope.error = response.message;
						$scope.loading = false;
					});
			}
			else
				$scope.loading = false; 
		};
	}]);