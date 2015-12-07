var server = require("../app.js").server;
var io = require('socket.io').listen(server);
var nname;
var rname;
var users = {};
var rooms = {};

io.on('connection', function(socket){  

	socket.join(rname);
	if(rooms[rname] == undefined){

		rooms[rname] = {};
		rooms[rname]["colorspace"] = [ "color:LightSkyBlue;", "color:LightGreen;", "color:LightCyan;", "color:red;", "color:Orange;", "color:Gold;"];
	}

	var user = {};
	var i = Math.floor((Math.random() * rooms[rname]["colorspace"].length));
	var color = rooms[rname]["colorspace"][i];
	rooms[rname]["colorspace"].splice(i, 1);
	user["name"] = nname;
	user["textColor"] = color;
	user["room"] = rname;
	users[socket["id"]] = user;
	var outstream = {};
	outstream["msg"] = users[socket["id"]]["name"] + ' JOINED CHAT';
	outstream["color"] = users[socket["id"]]["textColor"];
	rooms[rname][nname] = {};
	rooms[rname][nname]["name"] = nname;
	rooms[rname][nname]["color"] = 	users[socket["id"]]["textColor"];

	outstream["people"] = rooms[rname];
	io.to(rname).emit('update', outstream);

	socket.on('disconnect', function(){
		
		rname = users[socket["id"]]["room"];

		delete rooms[rname][  users[socket["id"]]["name"]];
		msg = users[socket["id"]]["name"] + ' LEFT CHAT';
		outstream["msg"] = msg;
		outstream["color"] = users[socket["id"]]["textColor"];
		rooms[rname]["colorspace"].push(users[socket["id"]]["textColor"]);
		delete users[socket["id"]];
		
		outstream["people"] = rooms[ rname ];
		io.to(rname).emit('update',  outstream);
		if(Object.keys(rooms[rname]).length == 0){

			delete rooms[rname];
		}
	})
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){

  	rname = users[socket["id"]]["room"];
  	var outstream = {}; 	
  	msg = users[socket["id"]]["name"]  + ": " +  msg;
	outstream["msg"] = msg;
	outstream["color"] = users[socket["id"]]["textColor"];
    io.to(rname).emit('chat message', outstream);

  });
});

exports.chat = function(req, res){

	nname = req.body.username;
	rname = req.body.rname;
	res.render('chatroom', { rname: rname });
};