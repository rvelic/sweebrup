var app = require('http').createServer(handler),
    io = require('socket.io')(app);

// socket.io will listen on this port
app.listen(3000);

// handler
function handler (req, res) {
  res.writeHead(200);
  res.end();
}

// array of unique nicknames joined to the conversation
var nicknames = [];

// handle socket app events
io.on('connection', function (socket) {
  // Send message - can be text or status
  socket.on('send message', function (message) {
    io.emit('receive message', message);
  });
  // Leave conversation
  socket.on('leave conversation', function (message) {
    var nickname = message.nickname.toLowerCase(),
        idx = nicknames.indexOf(nickname);
    // if nickname exists, free it for others to use
    if (idx > -1) {
      nicknames.splice(idx, 1);
    }    
    io.emit('receive message', message);
  });
  // Join user to conversation
  socket.on('join user', function (message) {
    var nickname = message.nickname.toLowerCase();
    if (nicknames.indexOf(nickname) < 0) {
      nicknames.push(nickname);
      io.emit('receive message', message);
    }
  });
});