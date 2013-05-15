var express = require('express')
  , app = express()
  , path = require('path')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , config = require('yaml-config');

var env = process.env.NODE_ENV || 'development';
var settings = config.readConfig(require.resolve('./config/app.yaml'), env);

console.log('env = %s', env);
console.log('on port: ', settings.server.port);

server.listen(settings.server.port);

app.configure(function(){
  app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/', function (req, res) {
  res.render('index');
});

io.sockets.on('connection', function (socket) {

  //pause
  socket.on('pause_track', function (data) {
	socket.broadcast.emit('pause_the_track', { action: 'pause' });
  });

  //play
  socket.on('play_track', function (data) {
	socket.broadcast.emit('play_the_track', { action: 'play' });
  });

  //play selected track
  socket.on('play_this_track', function (data) {
    console.log("sending selected track to be played");
    socket.broadcast.emit('play_that_track', { data: data });
  });

  //next
  socket.on('next_track', function (data) {
	socket.broadcast.emit('play_the_next_track', { action: 'next' });
  });

  //previous
  socket.on('previous_track', function (data) {
	socket.broadcast.emit('play_the_previous_track', { action: 'previous' });
  });

  //get track
  socket.on('get_track', function (data) {
	socket.broadcast.emit('get_the_track', { action: 'get_the_track' });
  });

  //track change triggered from  Spotify App
  socket.on('track_change', function (data) {
    socket.broadcast.emit('current_track_changed', { track_data: data });
  });

  socket.on('get_playlist', function (data) {
    socket.broadcast.emit('get_the_playlist', { action: 'get_the_playlist' });
  });

  socket.on('the_playlist', function (data) {
    socket.broadcast.emit('current_playlist', { tracks: data});
  });

});