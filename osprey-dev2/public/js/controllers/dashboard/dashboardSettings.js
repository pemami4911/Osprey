'use strict';

angular.module('dashboardSettingsModule', ['splashPageService', 'ngReactGrid', 'ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('dashboardSettingsController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
	function($scope, $http, $location, splashFactory) {
		// Toggles for Account Settings
		$scope.passwordCollapsed = true;
		$scope.emailCollapsed = true;
		$scope.newAccountSettings = {
			'changeEmail': {}, 
			'changePassword': {}
		}; 
		$scope.newTableSettings = {}; 

		$scope.changeEmail = function() {

			splashFactory.registerAttempt( $scope.newAccountSettings.changeEmail )
				.success(function (data) {
						if (data >= 1) {
							window.alert("This e-mail address is already in use."); 	
						}
						else {
							splashFactory.changeEmail( $scope.loggedUser.email, $scope.newAccountSettings.changeEmail.password, $scope.newAccountSettings.changeEmail.email )
								.success(function (data) {
									if (data == 1) {
										$scope.checkLogged();
										window.alert("You have successfully changed your e-mail!");
									}
									else if ( data === "err1" ) {
										window.alert("The current email you entered is not valid."); 
									}
									else if ( data === "err2" ) {
										window.alert("The password you entered is incorrect."); 
									}
									else
										console.log( data ); 
								}).error(function (response){
									console.log(response);
									$scope.error = response.message; 
							});
						}
				}).error(function (response) {
					$scope.error = response.message;
			});	
		};

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
				.success(function (data) {
					
					if (data == 1) {
						window.alert("You have successfully changed your table settings!");
						$scope.checkLogged();
					}
				}).error(function (response){
					console.log(response);
					$scope.error = response.message; 
				});
		}



	}]);

