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
      otherwise({
        redirectTo: '/'
      });
  }]);
