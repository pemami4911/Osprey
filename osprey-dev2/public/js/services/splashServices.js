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
				var postBody = {};
				postBody.email = regData.email; 
				postBody.password = regData.password; 
				return $http.post('/auth/register', postBody);
			},

			isLoggedIn : function() {
				return $http.post('/auth/isLogged');
			},

			logoutAttempt : function(userData) {
				return $http.get('/auth/logout', userData); 
			},

			forgotPassword : function( user ) {
				var postBody = {};
				postBody.email = user.email; 
				return $http.post('/auth/forgotPassword', postBody); 
			},

			deleteAccount: function( userID, email, password) {
				var postBody = {};
				postBody.email = email; 
				postBody.password = password; 
				postBody.user_id = userID; 
				return $http.post('/settings/deleteAccount', postBody); 
			},

			changeEmail : function(currentEmail, password, newEmail) {
				var postBody = {};
				postBody.email = currentEmail;
				postBody.password = password;
				postBody.newEmail = newEmail;
				return $http.post('/settings/changeEmail', postBody);
			},

			changePassword : function(email, currentPassword, newPassword) {
				var postBody = {};
				postBody.email = email;
				postBody.password = currentPassword; 
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

			clearUser: function( email ) {
				var postBody = {"email":email}; 
				return $http.post('/debug/clearUser', postBody); 
			},

			getChildrenOfParent: function(parentId) {
				var postBody = {};
				postBody.parentId = parentId;
				return $http.post('/users/childrenOfParent', postBody);
			},

			getChildrenOfPhysician: function(physicianId) {
				var postBody = {};
				postBody.physicianId = physicianId;
				return $http.post('/users/childrenOfPhysician', postBody);
			},

			addChild: function(newChild) {
				return $http.post('/users/addChild', newChild);
			}

		}
	}]);

