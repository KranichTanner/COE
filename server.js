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
    
    socket.on("regAttempt", function (username, password, email) {

        connection.query("SELECT * FROM users WHERE email = '" + email + "'", function (err, rows, fields) {
            if (err) {
                throw err;
            }
            else {
                if (rows.length === 0) {
                    connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                        else {
                            if (rows.length === 0) {
                                connection.query("INSERT INTO users (username, password, email, timemade, lastlogin) VALUES ('" + username + "', '" + password + "', '" + email + "', 0, 0)", function (err, rows, fields) {
                                    if (err) {
                                        throw err;
                                    }
                                    else {
                                        console.log("Registration Successful!");
                                        socket.emit("regSuccess");
                                    }
                                });
                            }
                            else {
                                console.log("Registration Fail!");
                                socket.emit("regFail", "Given username is already taken!");
                            }
                        }
                    });
                }
                else {
                    console.log("Registration Fail!");
                    socket.emit("regFail", "Given email already has an account!");
                }
            }
        });

    });

    socket.on("loginAttempt", function (username, password) {
        connection.query("SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'", function (err, rows, fields) {
            if (err) {
                throw err;
            }
            else {
                if (rows.length === 0) {
                    console.log("Login Fail!");
                    socket.emit("loginFail", "Username or Password incorrect!");
                }
                else {
                    console.log("Login Successful!");
                    socket.emit("loginSuccess");
                }
            }
        });
    });

    socket.on("landAllGovData", function () {
        console.log("Land button clicked...");
        io.emit("landAllGovData", "Democracy");
    });

});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});