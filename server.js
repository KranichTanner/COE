var app = require("express")();
var mysql = require("mysql");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    port: "6000",
    user: "root",
    password: "root",
    database: "coe"
});

console.log("Connected to database");

io.on("connection", function (socket) {
    console.log("User has connected");
    
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
    
    socket.on("loadMap", function (iduser) {
        console.log("Loading map...");
        loadMap(iduser, socket);
    });

    socket.on("landClick", function (iduser) {
        console.log("Land button clicked...");
        landClick(iduser, socket);
    });
    
    socket.on("populationClick", function (iduser) {
        console.log("Population button clicked...");
        populationClick(iduser, socket);
    });
    
    socket.on('error', function (err) {
        console.error(err.stack);
    });

    socket.on("disconnect", function (socket) {
        console.log("User has disconnected.");
    });

});

http.listen(3000, function () {
    console.log("Listening on port 3000");
});

//Helper functions

function register(username, password, email){
    //Insert user data into users table
    connection.query("INSERT INTO users (username, password, email, timemade, lastlogin) VALUES ('" + username + "', '" + password + "', '" + email + "', 0, 0)", function (err) {//TODO Need madetime/last log time
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
                                    addStorage(rows[0].insertId);
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
}//addLand

function addPopulation(idlands, count) {
    //Insert new population into population table with land connection
    connection.query("SELECT * FROM landspopulation WHERE idlands = " + idlands + "", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 0) {
                connection.query("INSERT INTO population(count, happiness, employed, privEmployed, pubEmployed, migWorkers) VALUES(" + count + ", 50, 0, 0, 0, 0); SELECT LAST_INSERT_ID()", function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.query("INSERT INTO landspopulation(idlands, idpopulation) VALUES(" + idlands + ", " + rows[0].insertId + ")", function (err) {
                            if (err) throw err;
                        });
                    }
                });
            }
            else {
                console.log("ERROR: land " + idlands + " already has a population");
            }
        }
    });
}

function addStorage(idlands){
    //Insert new storage into storage table with land connection
    connection.query("SELECT * FROM landsstorage WHERE idlands = " + idlands + "", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length === 0) {
                connection.query("INSERT INTO storage(food, totfood, water, totwater, stone, totstone, wood, totwood, fiber, totfiber, dirt, totdirt, metal, totmetal, oil, totoil, electricity, totelectricity, precmetal, totprecmetal) VALUES(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); SELECT LAST_INSERT_ID()", function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    else {
                        connection.query("INSERT INTO landsstorage(idlands, idstorage) VALUES(" + idlands + ", " + rows[0].insertId + ")", function (err) {
                            if (err) throw err;
                        });
                    }
                });
            }
            else {
                console.log("ERROR: land " + idlands + " already has a storage");
            }
        }
    });
}



function loadMap(iduser, socket){
    //Get current land biome and send back to client
    connection.query("SELECT biome FROM lands WHERE idlands IN (SELECT curridlands FROM users WHERE iduser = " + iduser + ")", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            console.log("Map loaded");
            socket.emit("loadMap", rows[0].biome);
        }
    });
}


function landClick(iduser, socket){
    //landAllGov
    
    //Get all lands associated with iduser
    connection.query("SELECT * FROM population WHERE idpopulation IN (SELECT idpopulation FROM landspopulation WHERE idlands IN (SELECT idlands FROM userslands WHERE iduser = " + iduser + "))", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var totpop = 0;
            var tothap = 0;
            for (x = 0; x < rows.length; ++x) {
                totpop += rows[0].count;
                tothap += rows[0].happiness;
            }
            //landAllPopCount
            socket.emit("displayData", "landAllPopCountData", totpop);
            //landAllAvgHapData
            socket.emit("displayData", "landAllAvgHapData", (tothap / rows.length) + "%");
            //landAllLandCountData
            socket.emit("displayData", "landAllLandCountData", rows.length);
        }
    });

    //TODO landAllTopResProData

    //TODO landAllTopImData

    //TODO landAllTopExData 

    //landCurData
    connection.query("SELECT curridlands FROM users WHERE iduser = " + iduser + "", function (err, rows) {
        if (err) {
            throw err;
        }
        else {//currid else
            
            var currid = rows[0].curridlands;
            connection.query("SELECT * FROM lands WHERE idlands = " + currid + "", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    //landCurNameData
                    socket.emit("displayData", "landCurNameData", rows[0].name);

                    //landCurCoordsData
                    socket.emit("displayData", "landCurCoordsData", "X: " + rows[0].xcoord + " &emsp;Y: " + rows[0].ycoord);

                    //landCurBiomeData
                    socket.emit("displayData", "landCurBiomeData", rows[0].biome);
                }
            });

            //landCurPopData
            connection.query("SELECT * FROM population WHERE idpopulation IN (SELECT idpopulation FROM landspopulation WHERE idlands = " + currid + ")", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    //landCurPopCountData
                    socket.emit("displayData", "landCurPopCountData", rows[0].count);

                    //landCurHapData
                    socket.emit("displayData", "landCurHapData", rows[0].happiness + "%");
                }
            });
            
            //Gets all structures associated with curr land
            connection.query("SELECT * FROM landsstructures WHERE idlands = " + currid + "", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    connection.query("SELECT buildSpots FROM lands WHERE idlands = " + currid + "", function (err, rows2) {
                        if (err) {
                            throw err;
                        }
                        else {
                            //landCurStructNumData
                            socket.emit("displayData", "landCurStructNumData", rows.length + "/" + rows2[0].buildSpots);
                        }
                    });

                    //TODO Structure being built
                    //TODO Structure built
                    //TODO Resources

                }
            });

            connection.query("SELECT * FROM userslands WHERE idlands <> " + currid + "", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    if (rows.length !== 0) {
                        for (x = 0; x < rows.length; ++x) {
                            var name, xcoord, ycoord, biome, pop, hap, topres, topim, topex;
                            var done = 0;
                            connection.query("SELECT * FROM lands WHERE idlands = " + rows[x].idlands + "", function (err, rows) {//Get land
                                if (err) {
                                    throw err;
                                }
                                else {
                                    name = rows[0].name;
                                    xcoord = rows[0].xcoord;
                                    ycoord = rows[0].ycoord;
                                    biome = rows[0].biome;
                                    ++done;

                                    connection.query("SELECT idpopulation FROM landspopulation WHERE idlands = " + rows[0].idlands + "", function (err, rows) {//Get population
                                        if (err) {
                                            throw err;
                                        }
                                        else {
                                            connection.query("SELECT * FROM population WHERE idpopulation = " + rows[0].idpopulation + "", function (err, rows) {
                                                pop = rows[0].count;
                                                hap = rows[0].happiness;
                                                ++done;
                                                displayExtraLand(done);
                                            });
                                        }
                                    });
                                    //TODO topres
                                    topres = "NA";
                                    ++done;
                                    displayExtraLand(done);
                                    //TODO topim
                                    topim = "NA";
                                    ++done;
                                    displayExtraLand(done);
                                    //TODO topex
                                    topex = "NA";
                                    ++done;
                                    displayExtraLand(done);

                                    function displayExtraLand(done){
                                        if (done === 5) {
                                            socket.emit("displayExtraLand", name, xcoord, ycoord, biome, pop, hap + "%", topres, topim, topex, x);
                                        }
                                    };

                                }
                            });
                        }
                    }
                }
            });

        }//currid else
    });
}

function populationClick(iduser, socket){
    //Gets all populations associated to each land of the user
    //TODO change other similar queries with below
    connection.query("SELECT * FROM population WHERE idpopulation IN (SELECT idpopulation FROM landspopulation WHERE idlands IN (SELECT idlands FROM userslands WHERE iduser = " + iduser + "))", function (err, rows) {
        if (err) {
            throw err;
        }
        else {
            var totpop = 0;
            var highpop = rows[0].count;
            var highpopid = 0;
            var lowpop = rows[0].count;
            var lowpopid = 0;
            var tothap = 0;
            var highhap = rows[0].happiness;
            var highhapid = 0;
            var lowhap = rows[0].happiness;
            var lowhapid = 0;
            var totemp = 0;
            var highemp = rows[0].employed;
            var highempid = 0;
            var lowemp = rows[0].employed;
            var lowempid = 0;
            
            for (x = 0; x < rows.length; ++x) {
                totpop += rows[x].count;

                if (rows[x].count >= highpop) {
                    highpop = rows[x].count;
                    highpopid = rows[x].idpopulation;
                }

                if (rows[x].count <= lowpop) {
                    lowpop = rows[x].count;
                    lowpopid = rows[x].idpopulation;
                }

                tothap += rows[x].happiness;

                if (rows[x].happiness >= highhap) {
                    highhap = rows[x].happiness;
                    highhapid = rows[x].idpopulation
                }

                if (rows[x].happiness <= lowhap) {
                    lowhap = rows[x].happiness;
                    lowhapid = rows[x].idpopulation
                }

                totemp += rows[x].employed;

                if (rows[x].employed >= highemp) {
                    highemp = rows[x].employed;
                    highempid = rows[x].idpopulation
                }
                
                if (rows[x].employed <= lowemp) {
                    lowemp = rows[x].employed;
                    lowempid = rows[x].idpopulation
                }

            }
            //popAllCountData
            socket.emit("displayData", "popAllCountData", totpop);

            //popAllHighCountData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + highpopid + ")", function (err, rows) {//Gets name of land associated with highest population
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllHighCountData", highpop + "&emsp;" + rows[0].name);
                }
            });

            //popAllLowCountData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + lowpopid + ")", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllLowCountData", lowpop + "&emsp;" + rows[0].name);
                }
            });

            //popAllHapAvgData
            socket.emit("displayData", "popAllHapAvgData", (tothap / rows.length) + "%");

            //popAllHighHapData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + highhapid + ")", function (err, rows) {//Gets name of land associated with highest population
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllHighHapData", highhap + "&emsp;" + rows[0].name);
                }
            });
            
            //popAllLowHapData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + lowhapid + ")", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllLowHapData", lowhap + "&emsp;" + rows[0].name);
                }
            });

            //popAllEmployData
            socket.emit("displayData", "popAllEmployData", totemp);
            
            //popAllHighEmployData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + highempid + ")", function (err, rows) {//Gets name of land associated with highest population
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllHighEmployData", highemp + "&emsp;" + rows[0].name);
                }
            });
            
            //popAllLowEmployData
            connection.query("SELECT name FROM lands WHERE idlands IN (SELECT idlands FROM landspopulation WHERE idpopulation = " + lowempid + ")", function (err, rows) {
                if (err) {
                    throw err;
                }
                else {
                    socket.emit("displayData", "popAllLowEmployData", lowemp + "&emsp;" + rows[0].name);
                }
            });

        }
    });

    //Gets current population
    connection.query("SELECT * FROM population WHERE idpopulation IN (SELECT idpopulation FROM landspopulation WHERE idlands IN (SELECT curridlands FROM users WHERE iduser = " + iduser + "))", function (err, rows) {
        if (err) {
            throw err
        }
        else {
            //popCurCountData
            socket.emit("displayData", "popCurCountData", rows[0].count);

            //popCurHapData
            socket.emit("displayData", "popCurHapData", rows[0].happiness);

            //popCurEmployData
            socket.emit("displayData", "popCurEmployData", rows[0].employed);

            //popCurPubEmployData
            socket.emit("displayData", "popCurPubEmployData", rows[0].pubEmployed);

            //popCurPrivEmployData
            socket.emit("displayData", "popCurPrivEmployData", rows[0].privEmployed);

            //popCurMigWorkData
            socket.emit("displayData", "popCurMigWorkData", rows[0].migWorkers);
        }
    });
}