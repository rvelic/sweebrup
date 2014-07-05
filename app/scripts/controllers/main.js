'use strict';

/**
 * @ngdoc function
 * @name sweebrupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sweebrupApp
 */
angular.module('sweebrupApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
