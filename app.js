/**
 * The Future is Now - SXSW 2013
 * @author Matt Null - http://mattnull.com
 */

var express = require('express')
  , app = express()
  , http = require('http')
  , fs = require('fs')
  , server = http.createServer(app)
  , path = require('path')
  , twitter = require('ntwitter');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


var twit = new twitter({
  consumer_key: 'lFACyPpFfsUdHZddGMTGg',
  consumer_secret: 'HS8vwMR5hB4cw4ZZb4at5SEHlW9NELyOHO4sOwQ',
  access_token_key: '121854213-5JlEFcN18IYZUPXo9mLt1OWv6DvQwDRnW22cJ8dh',
  access_token_secret: 'p6yBIShpliMlls5qf6JvZl9QoYpdawHqIkowXqZTY'
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
// io.enable('browser client minification');  // send minified client
// io.enable('browser client etag');          // apply etag caching logic based on version number
// io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

// // enable all transports (optional if you want flashsocket support, please note that some hosting
// // providers do not allow you to create servers that listen on a port different than 80 or their
// // default port)
// io.set('transports', [
//     'websocket'
//   , 'flashsocket'
//   , 'htmlfile'
//   , 'xhr-polling'
//   , 'jsonp-polling'
// ]);

// io.configure('development', function(){
//   io.set('transports', ['websocket']);
// });

// client object
var clients = {}

io.sockets.on('connection', function (socket) {
  // ------ CHAT
  //when the user connects add them to our users object
  clients[socket.id] = {id : socket.id, nickname : false};

  //immediately tell the chat room someone has connected
  socket.broadcast.emit('userEntered', {id : socket.id});
  socket.emit('userList', clients);
  socket.emit('setClientID', socket.id);

  socket.on('sendMessage', function (data) {
    var message = data.message || '';
    var user = data.user || socket.id;

    //broadcast the update and send it to the sender
    socket.broadcast.emit('chatUpdate', {user : user, message : message});
    socket.emit('chatUpdate', {user : user, message : message});

  });

  socket.on('updateUser', function(user){
    //update their nickname in memory
    clients[socket.id].nickname = user;
    socket.broadcast.emit('userUpdate', {id : socket.id, user: user});
    socket.emit('userUpdate', {id : socket.id, user: user});
  });

  socket.on('disconnect', function(){
    delete clients[socket.id];
    socket.broadcast.emit('userLeft', {id : socket.id})
    socket.emit('userList', clients);
  });


  //Video Chat
  socket.on('checkUserStatus', function(data){
    var inSession = !clients[data.to] || !clients[data.to].inSession ? data.to : false;
    socket.emit('userStatus', inSession)
  });

  socket.on('streamVideo', function(data){
    if(io.sockets.sockets[data.to]){
      io.sockets.sockets[data.to].emit('videoStream', data)
    }
  });

  socket.on('streamAudio', function(data){
    if(io.sockets.sockets[data.to]){
      io.sockets.sockets[data.to].emit('audioStream', data)
    }
  });
  // ------ END CHAT

  // -- Twitter Example
    //Twitter example
  socket.on('fetchTweets', function (data) {
    search = data.search || 'sxsw'
    twit.stream('statuses/filter', {track : search}, function(stream) {
      stream.on('data', function (data) {
        socket.emit('tweets', data)
      });
    });
  });
});