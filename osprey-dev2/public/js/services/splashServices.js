'use strict';
angular.module('splashPageService', [])

	// super simple service
	// each function returns a promise object 
	.service('splashFactory', ['$http',function($http) {

		var regEmail = '';
		// window.alert(savedData);
		var set = function (data) {
			regEmail = data;
		}
		var get = function () {
			return regEmail;
		}

		return {
			loginAttempt : function(loginData) {
				return $http.post('/auth/login', loginData);
			},	

			registerAttempt : function(loginData) {
				return $http.post('/auth/checkReg', loginData);
			},

			registerFinal : function(regData) {
				return $http.post('auth/register', regData);
			},

			set : set,

			get : get
		}
	}]);

