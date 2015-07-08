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

mongoose.connect('mongodb://localhost/DIntern_HW1');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Database Connected.");
});

var mySchema = new mongoose.Schema({
	username: String,
	message: String
});
var myModel = db.model('msgLog', mySchema);	


io.on('connection', function(socket) {
	
	socket.on('add user', function(username) {
		console.log(username + " connected");
		socket.username = username;
	
		myModel.find({}, function(err, data) {
			if(!err) { 
				//console.log(data.username);
				socket.emit('history log', data);
			}
		});
	});
	
	socket.on('new message', function(msg){
		console.log(socket.username + ': ' + msg);
		var data = {
			username: socket.username,
			message: msg
		};
		var msgLog = new myModel({
			username: socket.username,
			message: msg
		});
		msgLog.save(function(error) {
			if (error) 
				console.log("Error, ChatModel not saved");
			else 
				console.log("Success: ChatModel saved");
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

http.listen(8080, function() {
  console.log('listening on :8080');
});
