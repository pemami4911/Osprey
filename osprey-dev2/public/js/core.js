var ospreyApp = angular.module('ospreyCoreApp', [
	'ngRoute', 
	'splashPageModule', 
	'splashPageService', 
	'regParentPageModule',
  'regPhysicianPageModule',
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
      otherwise({
        redirectTo: 'views/splash.html'
      });
  }]);
