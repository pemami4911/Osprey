var ospreyApp = angular.module('ospreyCoreApp', [
	'ngRoute', 
	'splashPageModule', 
	'splashPageService', 
	'regPageModule'
]);


ospreyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/splash.html',
        controller: 'splashController'
      }).
      when('/registration', {
        templateUrl: 'views/registration.html',
        controller: 'regController'
      }).
      otherwise({
        redirectTo: 'views/splash.html'
      });
  }]);
