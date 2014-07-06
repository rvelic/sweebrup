'use strict';

/*
  Simple mock for socket.io
  see: https://github.com/btford/angular-socket-io-seed/issues/4
*/
var SockMock = function(){
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
        callback(data);
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
    aside,
    socketMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    modal = jasmine.createSpy('modal'); // spy on modal
    aside = jasmine.createSpy('aside'); // spy on aside
    socketMock = new SockMock(); // mock the socket.io
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      Socket: socketMock,
      $modal: modal,
      $aside: aside
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

  it('should join a user and hide the modal', function () {
    socketMock.on('join user', function () {
      socketMock.emit('receive message', { 
        status: 'joined',
        nickname: 'Roman',
      });
    });

    scope.modalInstance = {
      hide: jasmine.createSpy('scope.modalInstance.hide')
    };

    scope.join('Roman');

    expect(scope.modalInstance.hide).toHaveBeenCalled();
  });

  it('should remove the user from conversation and show the modal', function () {
    socketMock.on('leave conversation', function () {
      socketMock.emit('receive message', { 
        status: 'left',
        nickname: 'Roman',
      });
    });

    scope.modalInstance = {
      show: jasmine.createSpy('scope.modalInstance.show'),
      hide: jasmine.createSpy('scope.modalInstance.hide'),
    };

    scope.join('Roman');
    scope.leave();

    expect(scope.modalInstance.show).toHaveBeenCalled();
  });

  it('should send gift and hide aside instance', function () {
    socketMock.on('send gift', function () {
      socketMock.emit('receive message', { 
        gift: 'Drink',
        from: 'Roman',
        to: 'Rene',
      });
    });

    scope.asideInstance = {
      hide: jasmine.createSpy('scope.asideInstance.hide'),
      show: jasmine.createSpy('scope.asideInstance.show'),
    };

    scope.join('Roman');
    scope.sendGift('Drink', 'Rene');

    expect(scope.asideInstance.hide).toHaveBeenCalled();
  });
});