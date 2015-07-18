var app = require("express")();
var mysql = require("mysql");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: "6000",
    user: "root",
    password: "root",
    database: "coe"
});

console.log("Connected to database");

io.on("connection", function (socket) {
    console.log("User has connected");

    socket.on("disconnect", function (socket) {
        connection.end();
        console.log("User has disconnected.");
    });
    
    socket.on("loginAttempt", function (username, password) {
        connection.query("SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'", function (err, rows, fields) {
            if (err) {
                throw err;
            }
            else {
                if (rows.length === 0) {
                    socket.emit("loginSuccess", false);
                }
                else {
                    socket.emit("loginSuccess", true);
                }
            }
        });
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