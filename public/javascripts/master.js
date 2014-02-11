var socket = io.connect('http://192.168.0.23');
//
var play_track_button;
//
var current_track = document.getElementById('current_track');
var queue = document.getElementById('queue');
var pagination = document.getElementById('pagination');
var playlist = document.getElementById('playlist');
//
var play_button  = document.getElementById("play");
var pause_button  = document.getElementById("pause");
var next_button  = document.getElementById("next");
var previous_button  = document.getElementById("previous");
controls_setup();
//
var current_uri;

console.log("asking for track");
socket.emit('get_track', { action: 'get track' });

console.log("asking for playlist length");
socket.emit('get_playlist_length', { action: 'get playlist length' });

console.log("asking for queue");
socket.emit('get_queue', { action: 'get queue' });

socket.on('current_playlist', function (data) {
    html = new EJS({url: '/views/playlist/show.ejs'}).render(data)
    playlist.innerHTML = html;
    playlist_setup();
    new Tablesort(document.getElementById('table-libary'));
});

socket.on('current_playlist_length', function (data) {
    num_pages = Math.round(data.length/50);
   	html = new EJS({url: '/views/playlist/pagination.ejs'}).render(num_pages);
   	pagination.innerHTML = html;
   	pagination_setup();
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
    current_uri = data.track_data.uri;
    //
    var cover = document.getElementById("cover")
    cover_img_url = data.track_data.cover.split(":");
  	cover_img = new Image();
  	cover_img.src = "http://o.scdn.co/300/" + cover_img_url[2];
  	cover_img.onload = function() {
    	cover.innerHTML = '';
    	cover.appendChild(cover_img);
  	}


});


function pagination_setup() {
	var pagination_buttons = document.getElementsByClassName('pages');

	for(var i=0;i<pagination_buttons.length;i++) {
		pagination_buttons[i].onclick = function() {
			socket.emit('get_playlist', { from: this.getAttribute("data-pages-from"), to: this.getAttribute("data-pages-to") });

			var selected = document.getElementsByClassName('active');
			for(var i = 0; i<selected.length;i++) {
			   selected[i].className = selected[i].className.replace('active','');
			}
			this.parentNode.className += " active";
			return false;
		}
	}
}

function playlist_setup() {
	var queue_track_buttons = document.getElementsByClassName('queue-track');

	for(var i=0;i<queue_track_buttons.length;i++) {
		queue_track_buttons[i].onclick = function() {
			console.log('queue this track: '+this.getAttribute("data-track-uri"));
			socket.emit('queue_this_track', { data: this.getAttribute("data-track-uri") });
			return false;
		}
	}
	
}

function queue_setup() {
	var remove_track_buttons = document.getElementsByClassName('remove-track');

	for(var i=0;i<remove_track_buttons.length;i++) {
		remove_track_buttons[i].onclick = function() {
			console.log('remove this track: '+this.getAttribute("data-track-uri"));
			socket.emit('remove_this_track', { data: this.getAttribute("data-track-uri") });
			return false;
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
		current_uri = null;
	}
	next_button.onclick = function() {
		socket.emit('next_track', { action: 'next' });
		current_uri = null;
	}
}
