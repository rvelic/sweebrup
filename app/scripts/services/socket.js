'use strict';

/**
 * @ngdoc service
 * @name sweebrupApp.Socket
 * @description
 * # Socket
 * Factory in the sweebrupApp.
 */
angular.module('sweebrupApp')
  .factory('Socket', function () {
    /* global io */
    var socket = io.connect('http://localhost:3000');
    // return the socket.io public API
    return socket;
  });
