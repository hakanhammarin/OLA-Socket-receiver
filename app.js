var net = require('net');
var fs = require('fs');
var olaData = "";
var clientConnections=0;

var http = require('http').createServer(function handler(req, res) {
 fs.readFile(__dirname + '/index.html', function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}).listen(3000);

var io = require('socket.io').listen(http);
io.set('log level', 1);
io.sockets.on('connection', function(socket) {
  console.log('Client connected');
  socket.join('subscribe');
  io.sockets.emit('event', olaData); 
  clientConnections += 1;
  console.log('Initiated Connections: '+clientConnections);
  
 });
 
var _ = require('underscore');
var controlStatus = _.object(['100','135','200','209','41'],['red','green','yellow','red','red'])
console.log(controlStatus);

var client = new net.Socket();
client.connect(9090, '192.168.1.20', function() {
	console.log('Connected');
});

client.setEncoding('utf8');


 
client.on('data', function(data) {
//console.log(data);
//console.log('Received: ' + data);
	var arr = data.replace(/[\r\n]/g,"").split(';');

console.log('Array: '+arr); 

if (arr.indexOf('Time') == 0) {
console.log('TIME');
var olaData = _.object(['event','time'],arr);
io.sockets.emit('event', olaData); 
}; 

if (arr.indexOf('SplitTime') == 0) {
console.log('SPLITTIME');
var olaData = _.object(['event','si','control','time','time2'],arr);
console.log(olaData);
console.log(olaData.time);
olaData.time2 = (olaData.time/100/60);
console.log(olaData.time2);
console.log(olaData);
io.sockets.emit('event', olaData); 

// io.sockets.emit('controlStatus', olaData.control); 

}; 

if (arr.indexOf('Result') == 0) {
console.log('RESLUT');
	var olaData = _.object(['event','si','result','time'],arr);
	io.sockets.emit('event', olaData); 
	io.sockets.emit('controlStatus', controlStatus); 

}; 



// console.log(olaData);
	

	//client.destroy(); // kill client after server's response
});
 
client.on('close', function() {
	console.log('Connection closed');
});