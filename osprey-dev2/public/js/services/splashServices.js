'use strict';

angular.module('splashPageService', [])

	.factory('splashFactory', ['$http',function($http) {

		var regEmail = '';
		var userType = ''; 

		var set = function (data, type) {
			if (type === 'e-mail')
				regEmail = data;
			else if (type === 'userType')
				userType = data; 
		}

		var get = function (type) {
			if (type === 'e-mail')
				return regEmail;
			else if( type === 'userType')
				return userType; 
		}

		return {
			loginAttempt : function(loginData) {
				return $http.post('/auth/login', loginData);
			},	

			registerAttempt : function(initRegData) {
				return $http.post('/auth/checkReg', initRegData);
			},

			registerFinal : function(regData) {
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
				return $http.post('/users/unassignedParents');
			},

			test: function() {
				return $http.post('/debug/test');
			},

			set : set,

			get : get
		}
	}]);

