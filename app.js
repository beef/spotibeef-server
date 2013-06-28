
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , routes = require('./routes')
  , http = require('http').createServer(app)
  , io = require('socket.io').listen(http)
  , path = require('path')


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {

  socket.on('playing', function (data) {
    socket.broadcast.emit('control_state_change', { action: 'playing' });
  });

  socket.on('paused', function (data) {
    socket.broadcast.emit('control_state_change', { action: 'paused' });
  });

  //pause
  socket.on('pause', function (data) {
	 socket.broadcast.emit('pause_the_track', { action: 'pause' });
  });

  //play
  socket.on('play', function (data) {
    socket.broadcast.emit('start_playing', { action: 'play' });
  });

  //queue selected track
  socket.on('queue_this_track', function (data) {
    console.log("sending selected track to be queued");
    socket.broadcast.emit('queue_that_track', { data: data });
  });

  //remove queued track
  socket.on('remove_this_track', function (data) {
    console.log("sending selected track to be removed");
    socket.broadcast.emit('remove_that_track', { data: data });
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

  //track change triggered from Spotify App
  socket.on('track_change', function (data) {
    socket.broadcast.emit('current_track_changed', { track_data: data });
  });

  //get the playlist
  socket.on('get_playlist', function (data) {
    socket.broadcast.emit('get_the_playlist', { action: 'get_the_playlist' });
  });

  socket.on('the_playlist', function (data) {
    socket.broadcast.emit('current_playlist', { tracks: data});
  });

  //get the queue
  socket.on('get_queue', function (data) {
    socket.broadcast.emit('get_the_queue', { action: 'get_the_queue' });
  });

  socket.on('the_queue', function (data) {
    socket.broadcast.emit('current_queue', { tracks: data});
  });

});
