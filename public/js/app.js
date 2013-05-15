var socket = io.connect('http://127.0.0.1');

document.body.onload = function() {
	console.log("asking for track");
	socket.emit('get_track', { action: 'get track' });
    console.log("asking for playlist");
    socket.emit('get_playlist', { action: 'get playlist' });
}

//pause current track
var pause_button  = document.getElementById("pause");
pause_button.onclick = function() {
	console.log('pause request sent');
	socket.emit('pause_track', { action: 'pause track' });
}

//play current track
var play_button  = document.getElementById("play");
play_button.onclick = function() {
	console.log('play request sent');
	socket.emit('play_track', { action: 'play track' });
}

//play next track
var next_button  = document.getElementById("next");
next_button.onclick = function() {
	console.log('next request sent');
	socket.emit('next_track', { action: 'next track' });
}

//play previous track
var previous_button  = document.getElementById("previous");
previous_button.onclick = function() {
	console.log('previous request sent');
	socket.emit('previous_track', { action: 'previous track' });
}

//show playlist
 socket.on('current_playlist', function (data) {

    console.log('recieved playlist');

    var playlist_element = document.getElementById("playlist");

    data.tracks.tracks.reverse();

    for(var i=0;i<data.tracks.tracks.length;i++) {
      //
      var tr = document.createElement("tr");
      var number = document.createElement("td");
      var track = document.createElement("td");
      var album = document.createElement("td");
      var artist = document.createElement("td");
      //
      track.setAttribute("class","track_name");
      track.setAttribute("data-track-uri", data.tracks.tracks[i].data.uri);
      //
      if(data.tracks.tracks[i].data.name=='') { data.tracks.tracks[i].data.name = 'No track' }
      if(data.tracks.tracks[i].data.album.name=='') { data.tracks.tracks[i].data.album.name = 'No album' }
      if(data.tracks.tracks[i].data.album.artist.name=='') { data.tracks.tracks[i].data.album.artist.name = 'No artist' }
     //
      number.innerHTML = i;
      track.innerHTML = data.tracks.tracks[i].data.name;
      album.innerHTML = data.tracks.tracks[i].data.album.name;
      artist.innerHTML = data.tracks.tracks[i].data.album.artist.name;
      //
      tr.appendChild(number);
      tr.appendChild(track);
      tr.appendChild(album);
      tr.appendChild(artist);

      playlist_element.appendChild(tr);

      //play selected track
      track.onclick = function() {
        console.log('play this track: '+this.getAttribute("data-track-uri"));
        socket.emit('play_this_track', { data: this.getAttribute("data-track-uri") });
      }

    }

    new Tablesort(document.getElementById('sort'));
    document.getElementById("loading").style.display = 'none';

 });

//update currently playing track
socket.on('current_track_changed', function (data) {

  console.log('current track changed');

  var name = document.getElementById("name");
  var album = document.getElementById("album");
  var artist = document.getElementById("artist");
  var cover = document.getElementById("cover");
 
  name.innerHTML = data.track_data.name;
  album.innerHTML = data.track_data.album;
  artist.innerHTML = data.track_data.artist;

  cover_img_url = data.track_data.cover.split(":");
  cover_img = new Image();
  cover_img.src = "http://o.scdn.co/300/" + cover_img_url[2];
  cover_img.onload = function() {
    cover.innerHTML = '';
    cover.appendChild(cover_img);
  }

});