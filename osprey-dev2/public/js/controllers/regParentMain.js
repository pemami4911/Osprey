/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
angular.module('regParentPageModule', ['splashPageService'])

	// inject the Todo service factory into our controller
	.controller('regParentController', ['$scope','$http', '$location', 'splashFactory', '$cookieStore', function($scope, $http, $location, splashFactory, $cookieStore) {
		$scope.regData = {};
		$scope.regData.userType = $cookieStore.get( 'userType' );  
		$scope.regData.email = $cookieStore.get( $scope.regData.userType ); 
		$scope.regData.physicianID = $cookieStore.get( $scope.regData.email ); 
		$scope.regData.physicianName = $cookieStore.get( $scope.regData.physicianID ); 
		$scope.regData.numChildren = 1;
		$scope.loading = false;
		
		$scope.back = function() {
			$location.path('/'); 
		}
		// $scope.$on is an event handler
		// $locationChangeStart is an angular event that is called every time a location change begins
		$scope.$on('$locationChangeStart', function (event, newURL) {
				var msg = "Are you sure you want to navigate away from this page? All input will be lost."; 
				var badURL1 = "dashboard";
				var badURL2 = "regPhysician";

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
					.success(function() {
						//console.log(data);
						$cookieStore.remove('userType'); 
						$cookieStore.remove($scope.regData.userType); 
						$cookieStore.remove($scope.regData.email); 
						$cookieStore.remove($scope.regData.physicianName);

						$location.path('/verify');		
					}).error(function(response) {
						$scope.error = response.message;
						window.alert(response.message); 
						$scope.loading = false;
					});
			}
			else
				$scope.loading = false;
		};

		$scope.options = [0, 1, 2, 3, 4, 5];

		$scope.getNumber = function(num) {
		    return new Array(num);   
		}
	}]);
