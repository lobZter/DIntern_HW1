var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));	// parse application/x-www-form-urlencoded
app.use(bodyParser.json());						// parse application/json

app.post("/send_msg", function(req, res) {
	console.log(req.body.msg);
	res.sendStatus(200);
});

// mongodb
mongoose.connect('mongodb://localhost/DIntern_HW1');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Database Connected.");
});

var mySchema = new mongoose.Schema({
	name: String,
	msg: String
});
var myModel = db.model('msgLog', mySchema);	


io.on('connection', function(socket) {
	
	socket.on('add user', function (username) {
		console.log(username + " connected");
		socket.username = username;
		
		var msgLog = new myModel(data);
		msgLog.find(query,function(error,output) {
			console.log(output);
		});
		
		//socket.emit('history log', );
	});
	
	socket.on('new message', function(msg){
		console.log(socket.username + ': ' + msg);
		var data = {
			//username: socket.username,
			username: "lobZter",
			message: msg
		};
		var msgLog = new myModel(data);
		msgLog.save(function saveChat(error, savedChatModel) {
			if (error) {
				console.log("Error, ChatModel not saved");
			}
			else {
				console.log("Success: ChatModel saved");
			}
		});
		io.emit('new message', {
			username: socket.username,
			message: msg
		});
	});
	
	socket.on('disconnect', function() {
		console.log(socket.username + ' disconnected');
	});
});

http.listen(55559, function() {
  console.log('listening on *:55559');
});
