Sweebr Up! [![Build Status](https://travis-ci.org/rvelic/sweebrup.svg?branch=master)](https://travis-ci.org/rvelic/sweebrup)
==========

An angular chat app with a [sweebr](https://www.sweebr.com) twist.

Installation
------------

You'll need to issue following commands to install all dependencies as in `.travis.yml`.

```
$ gem install sass compass
$ npm install -g bower grunt-cli karma
$ bower install
$ grunt
```

For development with a livereload watcher, you can replace the last command with `$ grunt serve`. This will open your browser at `http://localhost:9000` and watch for file changes.

You will also need a socket.io server which is expected by `app/scripts/services/socket.js`service to be at `http://localhost:3000`. You can use the simple node server bundled in this repo. Just run `$ node server.js`. If you ran 'grunt serve' the socket server will be proxied to `http://localhost:9000/socket.io`