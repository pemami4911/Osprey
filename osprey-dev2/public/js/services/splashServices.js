'use strict';

angular.module('splashPageService', [])

	// super simple service
	// each function returns a promise object 
	.factory('splashFactory', ['$http',function($http) {

		var regEmail = '';
		var userType = ''; 

		//window.alert(savedData);
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
				return $http.post('auth/register', regData);
			},

			set : set,

			get : get
		}
	}]);

