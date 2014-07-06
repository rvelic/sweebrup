'use strict';

/**
 * @ngdoc function
 * @name sweebrupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sweebrupApp
 */
angular.module('sweebrupApp')
  .controller('MainCtrl', function ($scope, Socket, $modal) {
    // init
    $scope.messages = [];
    $scope.glued = false;
    $scope.user = {};
    
    // Pre-fetch an external template populated with a custom scope
    $scope.modalInstance = $modal({
      scope: $scope,
      template: 'views/modal.html',
      animation: 'am-fade-and-scale',
      backdrop: 'static'
    });

    // emit request from user to join the conversation under a nickname
    $scope.join = function (nickname) {
      // do not let join empty user nickname
      if (nickname === '') {
        return;
      }
      $scope.user.nickname = nickname;
      $scope.user.date = new Date();
      $scope.user.status = 'joined';

      Socket.emit('join user', $scope.user);
    };

    // emit request from user to leave the conversation
    $scope.leave = function () {
      $scope.user.date = new Date();
      $scope.user.status = 'left';

      Socket.emit('leave conversation', $scope.user);
    };

    // emit request for new message
    $scope.sendMessage = function () {
      // do not send empty messages
      if ($scope.message === '') {
        return;
      }
      Socket.emit('send message', { 
        text: $scope.message,
        nickname: $scope.user.nickname,
        date: new Date()
      });
      
      $scope.message = undefined; // clear the input field
    };

    // push new message to messages array. 
    // Message can be a text from user or a status of user.
    Socket.on('receive message', function (message) {
      // if message nickname is ours and we just joined, we'll close the modal as well   
      if (message.status === 'joined' && message.nickname === $scope.user.nickname) {
        $scope.modalInstance.hide();
      }
      // if message nickname is ours and we just left, we'll open the modal as well   
      if (message.status === 'left' && message.nickname === $scope.user.nickname) {
        $scope.modalInstance.show();
      }
      $scope.messages.push(message);
      $scope.$digest();
      // fire autoscroll when new message appears
      $scope.glued = !$scope.glued;
      $scope.$apply();
    });
  });
