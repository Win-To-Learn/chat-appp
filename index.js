var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//arrays to store users and connections
users = [];
connections = []

server.listen(process.env.PORT || 3000);
console.log('Server running...');

//creating a route that requires a response
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//open a connection with socket.io
io.sockets.on('connection', function(socket){
	//events needed to be emitted here
	connections.push(socket); //add to connections array
	console.log('Connection: %s sockets connected', connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		//emit a new message event
		io.sockets.emit('new message', {msg: data, user:socket.username});
	});
	//New User
	socket.on('new user', function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});
	