// link a socket namespace to an element
// for the initial set-up of the page
const streams = [
  ['/water-1', '.ticker.water:eq(0)'],
  ['/water-2', '.ticker.water:eq(1)'],
  ['/water-3', '.ticker.water:eq(2)'],
  ['/water-4', '.ticker.water:eq(3)'],
  ['/sky-1', '.ticker.sky:eq(0)'],
  ['/sky-2', '.ticker.sky:eq(1)'],
  ['/land', '.ticker.land:eq(0)']
];

// to save the connected socket namespaces 
// for the button click event
const _sockets = [];

var animationEvent = whichAnimationEvent();

$(function() {
  // the socket set-up
  for (var i=0; i < streams.length; i++) {
    var stream = streams[i]; 
    add_socket(stream[0], stream[1]);
  }
  
  $('button').on('click', function(e) {
    e.preventDefault();
    
    // get a random namespace/socket
    var skt = _sockets[Math.floor(Math.random()*_sockets.length)];
    
    // "ask" for an unscheduled emoji/character
    skt.emit('addEmoji', skt.nsp);
    
    // run the animation
    $(this).addClass('clicked');
    
    // and remove the animation when finished
    $(this).on(animationEvent, function(event) {
      $(this)
        .off(animationEvent, function(event) {})
        .removeClass('clicked');
    });
  });
  
});

function add_socket(nsp, div) {
  // connect the socket with namespace
  // and the rendering to the specific
  // html element 
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
      $('.injected')
        .html(data.char != ' ' ? data.char : '&nbsp;&nbsp;')
        .addClass('inject')
        .on(animationEvent, function(event) {
          // remove the binding and the animation class
          $(this)
            .off(animationEvent, function(event) {})
            .removeClass('inject');
      });
    }
  });
}

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichAnimationEvent(){
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
        "animation"      : "animationend",
        "OAnimation"     : "oAnimationEnd",
        "MozAnimation"   : "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    }

    for (t in transitions){
        if (el.style[t] !== undefined){
            return transitions[t];
        }
    }
}
