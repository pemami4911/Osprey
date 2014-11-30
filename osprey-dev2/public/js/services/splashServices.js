'use strict';

angular.module('splashPageService', [])

	.factory('splashFactory', ['$http',function($http) {
		return {
			loginAttempt : function(loginData) {
				return $http.post('/auth/login', loginData);
			},	

			registerAttempt : function(initRegData) {
				return $http.post('/auth/checkReg', initRegData);
			},

			registerFinal : function(regData) {
				//console.log(regData);
				return $http.post('/auth/register', regData);
			},

			isLoggedIn : function() {
				return $http.post('/auth/isLogged');
			},

			logoutAttempt : function(userData) {
				return $http.get('/auth/logout', userData); 
			},

			changeEmail : function(currentEmail, password, newEmail) {
				var postBody = {};
				postBody.currentEmail = currentEmail;
				postBody.password = password;
				postBody.newEmail = newEmail;
				return $http.post('/settings/changeEmail', postBody);
			},

			changePassword : function(user, currentPassword, newPassword) {
				var postBody = {};
				postBody.user = user;
				postBody.currentPassword = currentPassword; 
				postBody.newPassword = newPassword;
				return $http.post('/settings/changePassword', postBody);
			},

			changeTableSettings : function(user, newSettings) {
				var postBody = {};
				postBody.user = user;
				postBody.newSettings = newSettings;
				return $http.post('/settings/changeTableSettings', postBody);
			},

			getUnassignedParents : function() {
				return $http.get('/users/unassignedParents');
			},

			generateInviteCodeEmail : function( id, email, patientEmail, currentPassword ) {
				var postBody = {
					'physicianID':id,
					'email':email,
					'password':currentPassword,
					'patientEmail':patientEmail 
				};
				return $http.post('/settings/generateInvite', postBody);
			},
			
			test: function() {
				return $http.post('/debug/test');
			},

			getChildrenOfParent: function(parentId) {
				var postBody = {};
				postBody.parentId = parentId;
				return $http.post('/users/childrenOfParent', postBody);
			}
		}
	}]);

