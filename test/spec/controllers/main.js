'use strict';

/*
  Simple mock for socket.io
  see: https://github.com/btford/angular-socket-io-seed/issues/4
*/

var SockMock = function($rootScope){
  this.events = {};

  // Receive Events
  this.on = function(eventName, callback){
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  };

  // Send Events
  this.emit = function(eventName, data, emitCallback){
    if(this.events[eventName]){
      angular.forEach(this.events[eventName], function(callback){
        $rootScope.$apply(function() {
          callback(data);
        });
      });
    }
    if(emitCallback) {
      emitCallback();
    }
  };
};

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('sweebrupApp'));

  var MainCtrl,
    scope,
    modal,
    socketMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    modal = jasmine.createSpy('modal'); // spy on modal
    socketMock = new SockMock($rootScope); // mock the socket.io
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      Socket: socketMock,
      $modal: modal
    });
  }));

  it('should instantiate the controller properly', function () {
    expect(MainCtrl).not.toBeUndefined();
  });

  it('should have no messages', function () {
    expect(scope.messages.length).toBe(0);
  });

  it('should not glue anything at the beginning', function () {
    expect(scope.glued).toBe(false);
  });

  it('should create modal instance', function () {
    expect(modal).toHaveBeenCalled();
  });

  it('should not send empty message', function () {
    var messageReceived = false;
    
    socketMock.on('send message', function () {
      messageReceived = true;
    });
    
    scope.message = '';
    scope.user.nickname = 'Roman';
    scope.sendMessage();

    expect(messageReceived).toBe(false);
  });

  it('should send a message', function () {
    var messageReceived = false;
    
    socketMock.on('send message', function () {
      messageReceived = true;
    });

    scope.message = 'Hello';
    scope.user.nickname = 'Roman';
    scope.sendMessage();

    expect(messageReceived).toBe(true);
    expect(scope.message).toBeUndefined();

  });

  it('should join a user and close the modal', function () {
    var messageReceived = false;
    
    socketMock.on('join user', function () {
      messageReceived = true;
    });

    scope.modalInstance = {
      hide: jasmine.createSpy('scope.modalInstance.hide')
    };

    scope.join('The Conversation', 'Roman');

    expect(messageReceived).toBe(true);
    expect(scope.modalInstance.hide).toHaveBeenCalled();

  });

});