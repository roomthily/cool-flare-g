
var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var chars = require('./public/emoji.json');
var random = require('random-js')();
var entries = require('object.entries');
var wsr = require('weighted-randomly-select');


app.use(express.static('public')); 

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

server.listen(8000);

// timing options (ms)
const _intervals = [1500, 3000, 4500, 2500, 5000];

// define the socket namespace details with charset 
// and injector as keys in the emoji.json file.
// includes the namespace parameter, the streaming 
// charset (charset) and the manually injected 
// charset (injector)
const _sockets = {
  sky1: {
    namespace: "/sky-1",
    charset: chars.sky,
    injector: chars.injectors.sky
  },
  sky2: {
    namespace: "/sky-2",
    charset: chars.weather,
    injector: chars.injectors.sky
  },
  water1 : {
    namespace: "/water-1",
    charset: chars.water,
    injector: chars.injectors.water
  },
  water2 : {
    namespace: "/water-2",
    charset: chars.water,
    injector: chars.injectors.water
  },
  water3 : {
    namespace: "/water-3",
    charset: chars.water,
    injector: chars.injectors.water
  },
  water4 : {
    namespace: "/water-4",
    charset: chars.seafloor,
    injector: chars.injectors.seafloor
  },
  land : {
    namespace: "/land",
    charset: chars.land,
    injector: chars.injectors.land
  }
};


// set up the namespaced socket connections
for (var [k, v] of entries(_sockets)) { 
  add_socket(v.namespace, v.charset);
}

// initialize a socket
function add_socket(nsp, charset) {
  var socket = io.of(nsp);
  
  socket.on('connection', function(skt) {
    console.log('now connected: ' + nsp);
    
    // push an emoji char to the client
    // at an interval selected from our list
    var interval = setInterval(function() {
      skt.emit('stream', new_char(charset));
    }, random.pick(_intervals));  
    
    // push a different emoji (from a diff set)
    // if socket gets request from the client
    skt.on('addEmoji', function(data) {
      console.log('response: ', data);
      var injector = _set_by_namespace(data.trim());
      
      // add a flag for processing on the client.
      // (this probably should be changed to a different
      // tag on emit :/)
      var response = new_char(injector);
      response['injected'] = '1';
      skt.emit('stream', response);
    });
  });
}

function _set_by_namespace(ns) {
  for (var [k, v] of entries(_sockets)) {
    if (v.namespace === ns) {
      return v.injector;
    }
  }
  return [];
}

function new_char(set) {
  // select a char from the weighted set
  // and wrap in the json
  return {"char": wsr.select(set)};
}
