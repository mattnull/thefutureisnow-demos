var express = require('express')
var app = express();
var server = require('http').createServer(app);
server.listen(3000, function(){
	console.log('Server running on port 3000')
});
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/camera', function(req, res) {
  res.sendfile(__dirname + '/demos/camera.html');
});
app.get('/camera-snapshot', function(req, res) {
  res.sendfile(__dirname + '/demos/camera-snapshot.html');
});
app.get('/camera-snapshot-filter', function(req, res) {
  res.sendfile(__dirname + '/demos/camera-snapshot-filter.html');
});
app.get('/orientation', function(req, res) {
  res.sendfile(__dirname + '/demos/orientation.html');
});
app.get('/notifications', function(req, res) {
  res.sendfile(__dirname + '/demos/notifications.html');
});
app.get('/websockets', function(req, res) {
  res.sendfile(__dirname + '/demos/websockets.html');
});
app.get('/websockets-notifications', function(req, res) {
  res.sendfile(__dirname + '/demos/websockets-notifications.html');
});
app.get('/websockets-twitter-feed', function(req, res) {
  res.sendfile(__dirname + '/demos/websockets-twitter-feed.html');
});
