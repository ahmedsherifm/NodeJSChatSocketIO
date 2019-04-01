var express = require("express");
var socket = require("socket.io");

// app setup
var app = express();

var port = process.env.PORT || 5001;
var host = process.env.HOST || "localhost";

// initiate server
var server = app.listen(port, function () {
    console.log(`Listening at http://${host}:${port}`);
});

// use static files in public folder
app.use(express.static("public"));

// socket setup
// socket requires a server as parameter,
// for that we registered the app.listen into server variable so we can use it here
var io = socket(server);

// listening to any socket connection happens to the server from the client side
io.on("connection",function(socket){
    // log the connection with client socket connection id , {changes with every refresh}
    console.log(`Made Socket Connection ${socket.id}`);

    // here we need to listen to the message sent by the client using the socket
    // and reseve the object from the server in the parameter of the callback function
    socket.on("chat",function(data) {
        // io.sockets referes to all the sockets connected to the server
        // so we emit the chat message to all the clients again
        // and when receving the data we can put it on the screen to all the users
        io.sockets.emit("chat",data);
    });

    // Handle typing event so it looks cool using broadcast
    socket.on("typing",function (data) {
        socket.broadcast.emit("typing",data);
    });
});
