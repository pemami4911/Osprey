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

angular.module('dashboardSettingsModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('dashboardSettingsController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
	function($scope, $http, $location, splashFactory) {
		// Toggles for Account Settings
		$scope.passwordCollapsed = false;
		$scope.emailCollapsed = false;
		$scope.newAccountSettings = {
			'changeEmail': {}, 
			'changePassword': {}
		}; 
		$scope.newChild = {};
		$scope.newTableSettings = {};
		$scope.newTableSettings.email = $scope.loggedUser.phyShowEmail; 
		$scope.newTableSettings.age = $scope.loggedUser.phyShowAge; 
		$scope.newTableSettings.weight = $scope.loggedUser.phyShowWeight; 
		$scope.deleteAccount = {};
		$scope.isFirstOpen = true;

		// invite code vars
		$scope.inviteCode = {
			'patientEmail':'', 
			'currPassword':''
		}

		$scope.changeEmail = function() {
			splashFactory.changeEmail( $scope.loggedUser.username, $scope.newAccountSettings.changeEmail.password, $scope.newAccountSettings.changeEmail.email )
				.success(function () {
						$scope.checkLogged();
						window.alert("You have successfully changed your e-mail!");
				}).error(function (response){
					$scope.error = response.message; 	
				}); 
		}

		$scope.changePassword = function() {
			splashFactory.changePassword( $scope.loggedUser.username, $scope.newAccountSettings.changePassword.currentPassword, $scope.newAccountSettings.changePassword.newPassword )
				.success(function () {
						$scope.checkLogged();
						window.alert("You have successfully changed your password!");
				}).error(function (response){
					$scope.error = response.message;
				});
		}

		$scope.changeTableSettings = function() {
			splashFactory.changeTableSettings( $scope.loggedUser, $scope.newTableSettings )
				.success(function () {
					window.alert("You have successfully changed your table settings!");
					$scope.checkLogged();
				}).error(function (response){
					$scope.error = response.message; 
				});
		}

		$scope.generateInviteCodeEmail = function() {
			splashFactory.generateInviteCodeEmail( $scope.loggedUser.user_id, $scope.loggedUser.username, $scope.inviteCode.patientEmail, $scope.inviteCode.currPassword ) 
				.success ( function () {
					window.alert("Sent invite code"); 
				}).error ( function (response) {
					$scope.error = response.message; 
				}); 
		}

		$scope.deleteAccount = function() {
			var msg = "Are you sure you want to delete your account? This action can not be undone.";

			if( window.confirm( msg ) ) {
				splashFactory.deleteAccount( $scope.loggedUser.user_id,  $scope.loggedUser.username, $scope.deleteAccount.password )
					.success ( function ( data ) {
						window.alert(data.message); 
						$scope.checkLogged(); 
					}).error( function (response) {
						$scope.error = response.message;
						window.alert( $scope.error ); 
					});
			}
		}

		$scope.addChild = function() {
			splashFactory.addChild($scope.newChild)
				.success( function( data ) {
					window.alert("Child added successfully!");
					$scope.checkLogged($scope.getChildren);
				}).error( function( response ) {
					window.alert(response.message);
				});
		}

	}]);

