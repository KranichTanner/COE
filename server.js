var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

io.sockets.on("connection", function (socket) {
    console.log("User has connected");
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});