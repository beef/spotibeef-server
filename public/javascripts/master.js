var socket = io.connect('http://127.0.0.1');
//
var play_track_button;
//
var current_track = document.getElementById('current_track');
var queue = document.getElementById('queue');
var playlist = document.getElementById('playlist');
//
var play_button  = document.getElementById("play");
var pause_button  = document.getElementById("pause");
var next_button  = document.getElementById("next");
var previous_button  = document.getElementById("previous");
controls_setup();
//
var current_track_uri;

console.log("asking for track");
socket.emit('get_track', { action: 'get track' });

console.log("asking for playlist");
socket.emit('get_playlist', { action: 'get playlist' });

console.log("asking for queue");
socket.emit('get_queue', { action: 'get queue' });

socket.on('current_playlist', function (data) {
    html = new EJS({url: '/views/playlist/show.ejs'}).render(data)
    playlist.innerHTML = html;
    playlist_setup();
});

socket.on('current_queue', function (data) {
    html = new EJS({url: '/views/queue/show.ejs'}).render(data)
    queue.innerHTML = html;
    queue_setup();
});

socket.on('current_track_changed', function (data) {
    html = new EJS({url: '/views/current_track/show.ejs'}).render(data)
    current_track.innerHTML = html;
    queue_setup();
    //
    var cover = document.getElementById("cover")
    cover_img_url = data.track_data.cover.split(":");
  	cover_img = new Image();
  	cover_img.src = "http://o.scdn.co/300/" + cover_img_url[2];
  	cover_img.onload = function() {
    	cover.innerHTML = '';
    	cover.appendChild(cover_img);
  	}

  	current_track_uri = data.track_data.uri;
  	mark_playing_track();
});

function playlist_setup() {
	var queue_track_buttons = document.getElementsByClassName('queue-track');

	for(var i=0;i<queue_track_buttons.length;i++) {
		//
		queue_track_buttons[i].onclick = function() {
			console.log('queue this track: '+this.getAttribute("data-track-uri"));
			socket.emit('queue_this_track', { data: this.getAttribute("data-track-uri") });
		}
	}
	
}

function queue_setup() {
	var remove_track_buttons = document.getElementsByClassName('remove-track');

	for(var i=0;i<remove_track_buttons.length;i++) {
		remove_track_buttons[i].onclick = function() {
			console.log('remove this track: '+this.getAttribute("data-track-uri"));
			socket.emit('remove_this_track', { data: this.getAttribute("data-track-uri") });
		}
	}
	
}

function controls_setup() {
	play_button.onclick = function() {
		socket.emit('play', { action: 'play' });
	}
	pause_button.onclick = function() {
		socket.emit('pause', { action: 'pause' });
	}
	previous_button.onclick = function() {
		socket.emit('previous_track', { action: 'previous' });
	}
	next_button.onclick = function() {
		socket.emit('next_track', { action: 'next' });
	}
}

function mark_playing_track() {
	console.log(current_track_uri);
	var currently_playing = document.getElementsByClassName('playing');
	for(var i=0;i<tds.length;i++) {

	}
	var tds = document.getElementsByTagName('td');
	for(var i=0;i<tds.length;i++) {
		console.log(tds[i].getAttribute("data-track-uri"));
		if(tds[i].getAttribute("data-track-uri")===current_track_uri) {
			tds[i].className = tds[i].className = " playing";
			console.log('this matches');
		}
	}
}
