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

angular.module('splashPageService', [])

	.factory('splashFactory', ['$http',function($http) {
		return {
			loginAttempt : function(loginData) {
				return $http.post('/auth/login', loginData);
			},	

			registerAttempt : function(initRegData) {
				return $http.post('/auth/checkReg', initRegData);
			},

			/* 
 			 *	IMPORTANT: When adding new fields to the registration pages, 
 			 *  this function must be updated, as well as the createUser function in 
 			 *  app/schemas/users.js
			 **/
			registerFinal : function(regData) {
				var postBody = {};
				postBody.email = regData.email; 
				postBody.password = regData.password; 
				postBody.userType = regData.userType; 
				postBody.firstName = regData.firstName; 
				postBody.middleInitial = regData.mI; 
				postBody.lastName = regData.lastName; 
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

