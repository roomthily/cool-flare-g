const streams = [
  ['/water-1', '.ticker.water:eq(0)'],
  ['/water-2', '.ticker.water:eq(1)'],
  ['/water-3', '.ticker.water:eq(2)'],
  ['/water-4', '.ticker.water:eq(3)'],
  ['/sky-1', '.ticker.sky:eq(0)'],
  ['/sky-2', '.ticker.sky:eq(1)'],
  ['/land', '.ticker.land:eq(0)']
];

const _sockets = [];

$(function() {
  for (var i=0; i < streams.length; i++) {
    var thing = streams[i]; 
    add_socket(thing[0], thing[1]);
  }
  
  $('button').on('click', function(e) {
    e.preventDefault();
    
    // get a random namespace/socket
    var skt = _sockets[Math.floor(Math.random()*_sockets.length)];
    
    console.log('click', skt.nsp);
    
    // "ask" for an unscheduled emoji/character
    skt.emit('addEmoji', skt.nsp);
  })
  
});

function add_socket(nsp, div) {
  var socket = io(nsp);
  
  // save the initialized namespaced sockets for 
  // the button click event, where we want a 
  // random socket
  _sockets.push(socket);
  
  socket.on('stream', function(data) {
    // standard response to handle the
    // namespaced socket stream
    $(div).find('span').removeClass('pulse');
    var $s = $('<span>');
    $s.addClass('pulse');
    $s.html(data.char != ' ' ? data.char : '&nbsp;&nbsp;');
    $(div).prepend($s);
    
    var flag = data.injected || false;
    
    if (flag) {
      // add the char to the 'you added a thing!' 
      // display to know you added a thing!
      $('.injected').html(data.char != ' ' ? data.char : '&nbsp;&nbsp;');
    }
  });
}
