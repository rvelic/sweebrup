'use strict';

/**
 * @ngdoc function
 * @name sweebrupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sweebrupApp
 */
angular.module('sweebrupApp')
  .controller('MainCtrl', function ($scope, $modal) {

    $scope.user = {};
    
    // Pre-fetch an external template populated with a custom scope
    var modal = $modal({
      scope: $scope,
      template: 'views/modal.html',
      animation: 'am-fade-and-scale',
      backdrop: 'static'
    });

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
