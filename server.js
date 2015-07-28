var app = require("express")();
var mysql = require("mysql");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var connection = mysql.createConnection({
    multipleStatements: true,
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
    
    //User attempting to register a new account
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
                                console.log("Registration Success!");
                                socket.emit("regSuccess");
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
    
    //User attempting to login with preexisting account, iduser returned to client
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
                    socket.emit("loginSuccess", rows[0].iduser);
                }
            }
        });
    });

    socket.on("landClick", function (iduser) {
        console.log("Land button clicked...");
        landClick(iduser, socket);
    });

});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});

//Helper functions

function register(username, password, email){
    //Insert user data into users table
    connection.query("INSERT INTO users (username, password, email, timemade, lastlogin) VALUES ('" + username + "', '" + password + "', '" + email + "', 0, 0)", function (err) {//Need madetime/last log time
        if (err) throw err;
    });
    //Find a random land with at least one open neighbor spot and make a land there, starts creating land
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
                    if (rows.length === 0) {
                        addLand(username, x + 1, y, 5);
                    }
                    else {
                        connection.query("SELECT * FROM lands WHERE xcoord = '" + (x - 1) + "' AND ycoord = '" + y + "'", function (err, rows) {
                            if (err) {
                                throw err;
                            }
                            else {
                                if (rows.length === 0) {
                                    addLand(username, x - 1, y, 5);
                                }
                                else {
                                    connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y + 1) + "'", function (err, rows) {
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            if (rows.length === 0) {
                                                addLand(username, x, y + 1, 5);
                                            }
                                            else {
                                                connection.query("SELECT * FROM lands WHERE xcoord = '" + x + "' AND ycoord = '" + (y - 1) + "'", function (err, rows) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        if (rows.length === 0) {
                                                            placed = true;
                                                            addLand(username, x, y - 1, 5);
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

//Adds a land to user, sets current land to this new land.
function addLand(username, x, y, population){
    //Give a biome to new land through percent weighting of available biomes
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
    
    //Check neighbors of new land and update neighbor value for current land and neighbor found
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
            }
        }
        ++done;
        insertLand();
    });
    
    //Executed once all 4 neighbor checks have returned
    function insertLand() {
        if (done === 4) {
            //Inserts new land into lands table
            connection.query("INSERT INTO lands(name, xcoord, ycoord, biome, buildSpots, neighbor) VALUES('" + username + "s Land', " + x + ", " + y + ", '" + biome + "', 3, " + n + "); SELECT LAST_INSERT_ID()", function (err, rows) {
                if (err) {
                    throw err
                }
                else {
                    //Gets user to associate with land
                    connection.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, rows2) {
                        if (err) {
                            throw err;
                        }
                        else {
                            //Add user/land relation to userslands table
                            connection.query("INSERT INTO userslands(iduser, idlands) VALUES(" + rows2[0].iduser + ", " + rows[0].insertId + ")", function (err) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    addPopulation(rows[0].insertId, population);
                                }
                            });
                            connection.query("UPDATE users SET curridlands = " + rows[0].insertId + " WHERE iduser = " + rows2[0].iduser + "", function (err) { 
                                if (err) throw err;
                            });
                        }
                    });
                }
            });
        }
    };
}

function addPopulation(idlands, count) {
    //Insert new population into population table
    connection.query("INSERT INTO population(count, happiness, employed, privEmployed, pubEmployed, migWorkers) VALUES(" + count + ", 50, 0, 0, 0, 0); SELECT LAST_INSERT_ID()", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            //Connect land to population through landspopulation table
            connection.query("INSERT INTO landspopulation(idlands, idpopulation) VALUES(" + idlands + ", " + rows[0].insertId + ")", function (err) {
                if (err) throw err;
            });
        }
    });
}






function landClick(iduser, socket){
    //landAllGov

    //landAllPopCount
    connection.query("SELECT * FROM userslands WHERE iduser = " + iduser + "", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var totpop = 0;
            var done = 0;
            for (x = 0; x < rows.length; ++x) {
                connection.query("SELECT * FROM landspopulation WHERE idlands = " + rows[x].idlands + "", function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.query("SELECT * FROM population WHERE idpopulation = " + rows[0].idpopulation + "", function (err, rows) {
                            if (err) {
                                throw err;
                            }
                            else {
                                totpop += rows[0].count;
                                ++done;
                                postCount(done);
                            }

                        });
                    }
                });
            }
            function postCount(done){
                socket.emit("displayData", "landAllPopCountData", totpop);
            };
        }
    });

}