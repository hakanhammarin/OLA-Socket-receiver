//prewarning.js
var splittimes = require("./splittimes.js");
var fs = require('fs');
var warnings = 'no warnings' ;
var listsize = 1;
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
var currentPrewarning='';
var currentFinish='';

var querystring = 'SELECT results.bibNumber as BibNumber, entries.teamName as teamName,results.relayPersonOrder AS Leg, SUBSTR(passedTime,12,8) as Time ,controls.id as Control FROM splittimes INNER JOIN splittimecontrols ON splittimecontrols.splitTimeControlId=splittimes.splitTimeControlId INNER JOIN controls ON controls.controlId=splittimecontrols.timingControl INNER JOIN results ON splittimes.resultRaceIndividualNumber = results.resultId INNER JOIN entries ON entries.entryID = results.EntryId WHERE controls.id = "135" OR controls.id = "41" ORDER BY splittimes.passedTime DESC LIMIT 0,100;';

var querystringfinish = 'SELECT results.bibNumber as BibNumber, results.relayPersonOrder AS Leg, SUBSTR(passedTime,12,8) as Time ,controls.id as Control FROM splittimes INNER JOIN splittimecontrols ON splittimecontrols.splitTimeControlId=splittimes.splitTimeControlId INNER JOIN controls ON controls.controlId=splittimecontrols.timingControl INNER JOIN results ON splittimes.resultRaceIndividualNumber = results.resultId INNER JOIN entries ON entries.entryID = results.EntryId WHERE controls.id = "100"  OR controls.id = "200" ORDER BY splittimes.passedTime DESC LIMIT 0,100;';

function checkTime(i)
{
if (i<10)
  {
  i="0" + i;
  }
return i;
}

var mysql = require('mysql');
var MYSQL_USERNAME = 'root';
var MYSQL_PASSWORD = 'root';
 
var client = mysql.createConnection({
  host: 'localhost',
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
});
client.query('USE test10mila2014');

var io = require('socket.io').listen(http);
io.set('log level', 1);
io.sockets.on('connection', function(socket) {
  console.log('Client connected');
  socket.join('subscribe');
  io.sockets.emit('prewarning', currentPrewarning); 
  io.sockets.emit('finish', currentFinish); 
  clientConnections += 1;
  console.log('Initiated Connections: '+clientConnections);
  
 });
 
setInterval(function() { 
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	m=checkTime(m);
	s=checkTime(s);
	h=checkTime(h);
  
	console.log(h+':'+m+':'+s+' SQL Query: '+io.sockets.clients().length+' Connections'); 

client.query(querystring, function(err, results, fields) {
	io.sockets.emit('prewarning', results); 
	currentPrewarning=results;
	 console.log(results);
	});
client.query(querystringfinish, function(err, results, fields) {
	io.sockets.emit('finish', results); 
	currentFinish=results;
  });
  
  var today=new Date();
  var h=today.getHours();
  var m=today.getMinutes();
  var s=today.getSeconds();
  m=checkTime(m);
  s=checkTime(s);
  h=checkTime(h);
  
  io.sockets.emit('time', h+':'+m+':'+s); 
//alter the teams list although the database is from the 2013 event 
 listsize += 1
  
  
  }, 10000);
  
 // splittimes.get_splittimes(function(times) {
   // console.log(times);
  // });
  
  // populate employees on client
  
    
 