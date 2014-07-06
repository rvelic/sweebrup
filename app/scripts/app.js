'use strict';

/**
 * @ngdoc overview
 * @name sweebrupApp
 * @description
 * # sweebrupApp
 *
 * Main module of the application.
 */
angular
  .module('sweebrupApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap',
    'luegg.directives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
