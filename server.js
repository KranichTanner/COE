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
                                register(username, password, email);
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
        connection.query("SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'", function (err, rows) {
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

//Helper functions

function register(username, password, email){
    connection.query("INSERT INTO users (username, password, email, timemade, lastlogin) VALUES ('" + username + "', '" + password + "', '" + email + "', 0, 0)", function (err) {//Need madetime/last log time
        if (err) throw err;
    });
    connection.query("SELECT * FROM lands WHERE neighbor < 4 ORDER BY Rand() LIMIT 1", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var x = rows[0].xcoord;
            var y = rows[0].ycoord;
            connection.query("SELECT * FROM lands WHERE xcoord = '" + (x + 1) + "' AND ycoord = '" + y + "'", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("Hoods1");
                    if (rows.length === 0) {
                        addLand(username, x + 1, y);
                    }
                    else {
                        connection.query("SELECT * FROM lands WHERE xcoord = '" + (x - 1) + "' AND ycoord = '" + y + "'", function (err, rows) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("Hoods2");
                                if (rows.length === 0) {
                                    addLand(username, x - 1, y);
                                }
                                else {
                                    connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y + 1) + "'", function (err, rows) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            console.log("Hoods3");
                                            if (rows.length === 0) {
                                                addLand(username, x, y + 1);
                                            }
                                            else {
                                                connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y - 1) + "'", function (err, rows) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        console.log("Hoods4");
                                                        if (rows.length === 0) {
                                                            placed = true;
                                                            addLand(username, x, y - 1);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

}

function addLand(username, x, y){
    var biome = Math.floor((Math.random() * 100) + 1);
    if (biome <= 10) {
        biome = "Desert";
    }
    else if (biome > 10 && biome <= 30) {
        biome = "Tundra";
    }
    else if (biome > 30 && biome <= 70) {
        biome = "Plains";
    }
    else if (biome > 70 && biome <= 100) {
        biome = "Forest";
    }
    else {
        biome = "???";
    }
    
    var n = 0;
    var done = 0;
    connection.query("SELECT * FROM lands WHERE xcoord = '" + (x + 1) + "' AND ycoord = '" + y + "'", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 1) {
                ++n;
                connection.query("UPDATE lands SET neighbor = neighbor + 1 WHERE idlands = " + rows[0].idlands + "", function (err) {
                    if (err) throw err;
                });
                console.log("Goods1");
            }
        }
        ++done;
        insertLand();
    });
    connection.query("SELECT * FROM lands WHERE xcoord = '" + (x - 1) + "' AND ycoord = '" + y + "'", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 1) {
                ++n;
                connection.query("UPDATE lands SET neighbor = neighbor + 1 WHERE idlands = " + rows[0].idlands + "", function (err) {
                    if (err) throw err;
                });
                console.log("Goods2");
            }
        }
        ++done;
        insertLand();
    });
    connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y + 1) + "'", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 1) {
                ++n;
                connection.query("UPDATE lands SET neighbor = neighbor + 1 WHERE idlands = " + rows[0].idlands + "", function (err) {
                    if (err) throw err;
                });
                console.log("Goods3");
            }
        }
        ++done;
        insertLand();
    });
    connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y - 1) + "'", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 1) {
                ++n;
                connection.query("UPDATE lands SET neighbor = neighbor + 1 WHERE idlands = " + rows[0].idlands + "", function (err) {
                    if (err) throw err;
                });
                console.log("Goods4");
            }
        }
        ++done;
        insertLand();
    });
    
    function insertLand() {
        if (done === 4) {
            connection.query("INSERT INTO lands(name, xcoord, ycoord, biome, population, happiness, buildSpots, neighbor) VALUES('" + username + "s Land', " + x + ", " + y + ", '" + biome + "', 5, 50, 3, " + n + ")", function (err, rows) {
                if (err) {
                    throw err
                }
                else {
                    connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, rows) {
                        if (err) {
                            throw err;
                        }
                        else {
                            connection.query("SELECT * FROM lands WHERE xcoord = " + x + " AND ycoord = " + y + "", function (err, rows2) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    connection.query("INSERT INTO userslands(iduser, idlands) VALUES(" + rows[0].iduser + ", " + rows2[0].idlands + ")", function (err) {
                                        if (err) throw err;
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    };
}

/*else{
console.log("Registration Success!");
socket.emit("regSuccess");
}*/

