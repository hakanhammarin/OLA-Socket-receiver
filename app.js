var net = require('net');
var _ = require('underscore');
var controlStatus = _.object(['100','135','200','209','41'],['red','red','red','red','red'])
console.log(controlStatus);

var client = new net.Socket();
client.connect(9090, '192.168.1.22', function() {
	console.log('Connected');
	//client.write('Hello, server! Love, Client.');
});
client.setEncoding('utf8');
 
client.on('data', function(data) {
//console.log(data);
//console.log('Received: ' + data);
	var arr = data.replace(/[\r\n]/g,"").split(';');

//console.log('Array: '+arr);	


if (arr.indexOf('Time') == 0) {
console.log('TIME');
var olaData = _.object(['event','time'],arr);
}; 

if (arr.indexOf('SplitTime') == 0) {
console.log('SPLITTIME');
var olaData = _.object(['event','si','control','time'],arr);
}; 

if (arr.indexOf('Result') == 0) {
console.log('RESLUT');
	var olaData = _.object(['event','si','result','time'],arr);

}; 



console.log(olaData);
	

	//client.destroy(); // kill client after server's response
});
 
client.on('close', function() {
	console.log('Connection closed');
});