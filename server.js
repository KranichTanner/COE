var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", function (socket) {
    console.log("User has connected");

    socket.on("disconnect", function (socket) {
        console.log("User has disconnected.");
    });
    
    socket.on("loginUsername", function (data) {
        socket.emit("loginPassword", true);
    });
    
    socket.on("loginPassword", function (data) { 
        socket.emit("loginSuccess", true);
    });
    
    socket.on("loginSuccess", function () {
        console.log("Login Successful!")
    });
    
    socket.on("loginFail", function () { 
        console.log("Login Fail!");
        socket.emit("loginFail");
    });

    socket.on("landAllGovData", function () {
        console.log("Land button clicked...");
        io.emit("landAllGovData", "Democracy");
    });

});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});