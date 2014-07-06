'use strict';

/**
 * @ngdoc function
 * @name sweebrupApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sweebrupApp
 */
angular.module('sweebrupApp')
  .controller('MainCtrl', function ($scope, Socket, $modal, $aside, $alert) {
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

    // Pre-fetch an external template populated with a custom scope
    $scope.asideInstance = $aside({
      scope: $scope, 
      template: 'views/aside.html',
      show: false
    });

    $scope.gifts = [
      {value: 'Drink', label: '<span class="glyphicon glyphicon-glass"></span> Drink'},
      {value: 'Song', label: '<span class="glyphicon glyphicon-music"></span> Song'},
      {value: 'Movie', label: '<span class="glyphicon glyphicon-film"></span> Movie'},
      {value: 'Dinner', label: '<span class="glyphicon glyphicon-cutlery"></span> Dinner'}
    ];

    // emit request from user to join the conversation under a nickname
    $scope.join = function (nickname) {
      // do not let join empty user nickname
      if (!nickname) {
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
      if (!$scope.message) {
        return;
      }
      Socket.emit('send message', { 
        text: $scope.message,
        nickname: $scope.user.nickname,
        date: new Date()
      });

      $scope.message = undefined; // clear the input field
    };

    // emit request for new message
    $scope.sendGift = function (gift, buddy) {
      // do not send empty gifts
      if (!gift || !buddy) {
        return;
      }
      Socket.emit('send gift', { 
        gift: gift,
        nickname: $scope.user.nickname,
        buddy: buddy,
        date: new Date()
      });
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

    // receive and display error message if for the user
    Socket.on('error message', function (error) {
      if (error.nickname === $scope.user.nickname) {
        $alert({
          'title': 'Holy guacamole!',
          'content': error.message,
          'type': 'danger',
          'animation': 'am-fade-and-slide-top',
          'container': '.alerts-container',
          'duration': 3,
        });
      }
    });
  });
