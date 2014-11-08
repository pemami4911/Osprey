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
		$scope.newAccountSettings = {}; 
		$scope.newTableSettings = {}; 

		// CODE FOR SETTINGS PAGE:
		$scope.changeEmail = function() {
			splashFactory.changeEmail( $scope.loggedUser, $scope.newAccountSettings.newEmail )
				.success(function (data) {
					if (data == 1) {
						$scope.checkLogged();
						window.alert("You have successfully changed your e-mail!");
					}
				}).error(function (response){
					console.log(response);
				});
		};

		$scope.changePassword = function() {
			splashFactory.changePassword( $scope.loggedUser, $scope.newAccountSettings.newPassword )
				.success(function (data) {
					if (data == 1) {
						$scope.checkLogged();
						window.alert("You have successfully changed your password!");
					}
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

