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
  // Send gift
  socket.on('send gift', function (gift) {
    var nickname = gift.buddy.toLowerCase(),
        idx = nicknames.indexOf(nickname);
    // if nickname exists, we'll emit the message
    if (idx > -1) {
      // HERE WE CAN PERSIST GIFTS via Sweebr API / CouchDB
      io.emit('receive message', gift);
    } else {
      io.emit('error message', {
        nickname: gift.nickname,
        message: 'Wrong Nickname',
      });
    }
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
    } else {
      io.emit('error message', {
        nickname: message.nickname,
        message: 'Somebody already thought of that nickname. Be more creative.',
      });
    }
  });
});