var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// socket.io will listen on this port
app.listen(3000);

// handle requests
function handler (req, res) {
  fs.readFile(__dirname + 'index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('This is not the site you are loooking for.');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// handle socket app events
io.on('connection', function (socket) {
  socket.on('send message', function (message) {
    io.emit('receive message', message);
  });
  socket.on('join user', function (message) {
    io.emit('receive message', message);
  });
});