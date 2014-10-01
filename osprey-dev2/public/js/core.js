var ospreyApp = angular.module('ospreySplashPage', [
	'ngRoute', 
	'splashPageController', 
	'splashPageService', 
	'regPageController'
]);


ospreyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/splash.html',
        controller: 'mainController'
      }).
      when('/registration', {
        templateUrl: 'views/registration.html',
        controller: 'regController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);