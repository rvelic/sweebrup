'use strict';

/**
 * @ngdoc function
 * @name sweebrupApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sweebrupApp
 */
angular.module('sweebrupApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
