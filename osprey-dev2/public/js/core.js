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

var ospreyApp = angular.module('ospreyCoreApp', [
	'ngRoute', 
	'splashPageModule', 
	'splashPageService', 
	'regParentPageModule',
  'regPhysicianPageModule',
  'dashboardPageModule',
  'dashboardSettingsModule',
  'dashboardPatientsModule',
  'dashboardMyPatientModule',
  'ngCookies',
  'dashboardParentModule',
  'ui.bootstrap'
]);


ospreyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/splash.html',
        controller: 'splashController'
      }).
      when('/regParent', {
        templateUrl: 'views/regParent.html',
        controller: 'regParentController'
      }).
      when('/regPhysician', {
        templateUrl: 'views/regPhysician.html',
        controller: 'regPhysicianController'
      }).
      when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardController'
      }).
      when('/verify', {
         templateUrl: 'views/verify.html' 
      }).
      when('/forgotPassword', {
        templateUrl: 'views/forgotPassword.html',
        controller: 'splashController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
