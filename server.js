var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var msg = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));	// parse application/x-www-form-urlencoded
app.use(bodyParser.json());						// parse application/json

app.post("/send_msg", function(req, res) {
	console.log(req.body.msg);
	res.sendStatus(200);
});

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});

http.listen(55559, function() {
  console.log('listening on *:55559');
});


