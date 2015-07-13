var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());						// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));	// parse application/x-www-form-urlencoded


app.post("/send_msg", function(req, res) {
    console.log(req.body.msg);
    res.sendStatus(200);
});


mongoose.connect('mongodb://localhost/DIntern_HW1');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongodb connected.");
});

var mySchema = new mongoose.Schema({
    username: String,
    message: String,
    time: {type: Date, default: Date.now}
});
var myModel = db.model('msgLog', mySchema);

io.on('connection', function(socket) {
		
    socket.on('add user', function(username) {
        console.log(username + " connected");

        socket.username = username;

        myModel.find({}, function(err, data) {
            socket.emit('get history', data);
        });
    });

    socket.on('send msg', function(msg){
        console.log(socket.username + ': ' + msg);

        var data = {
            username: socket.username,
            message: msg
        };

        var msgLog = new myModel(data);
        msgLog.save();

        io.emit('get msg', data);
    });

    socket.on('disconnect', function() {
        console.log(socket.username + ' disconnected');
    });
});

http.listen(8080, function() {
    console.log('listening on :8080');
});
