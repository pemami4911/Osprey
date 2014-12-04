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
		$scope.newTableSettings = {}; 

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
					// }
					// else if ( data === "err1" ) {
					// 	window.alert("The current email you entered is not valid."); 
					// }
					// else if ( data === "err2" ) {
					// 	window.alert("The password you entered is incorrect."); 
					// }
					// else
					// 	console.log( data ); 
				}).error(function (response){
					console.log(response.message);
					$scope.error = response.message; 	
				}); 
		}

		$scope.changePassword = function() {
			splashFactory.changePassword( $scope.loggedUser, $scope.newAccountSettings.changePassword.currentPassword, $scope.newAccountSettings.changePassword.newPassword )
				.success(function (data) {
					if (data == 1) {
						$scope.checkLogged();
						window.alert("You have successfully changed your password!");
					}
					else if ( data === "err1" ) {
						window.alert("The email of the current user is not registered. You will be logged out now."); 
						$scope.loggedUser = null; 
						$location.path('/');
					}
					else if ( data === "err2" ) {
						window.alert("The password you entered is incorrect."); 
					}
					else
						console.log( data ); 
				}).error(function (response){
					console.log(response);
				});
		}

		$scope.changeTableSettings = function() {
			splashFactory.changeTableSettings( $scope.loggedUser, $scope.newTableSettings )
				.success(function () {
					window.alert("You have successfully changed your table settings!");
					$scope.checkLogged();
				}).error(function (response){
					console.log(response.message);
					$scope.error = response.message; 
				});
		}

		$scope.generateInviteCodeEmail = function() {
			splashFactory.generateInviteCodeEmail( $scope.loggedUser.user_id, $scope.loggedUser.username, $scope.inviteCode.patientEmail, $scope.inviteCode.currPassword ) 
				.success ( function (data) {
					window.alert("Sent invite code"); 
				}).error ( function (response) {
					console.log( response ); 
					$scope.error = response.message; 
				}); 
		}

	}]);

