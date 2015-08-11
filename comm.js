var socket = io.connect("http://76.24.39.132:3000");

function register() {
    //document.getElementById("regNot").innerHTML = "";
    if ($("#regPassword").val() === $("#regPasswordCon").val()) {
        socket.emit("regAttempt", $("#regUsername").val(), $("#regPassword").val(), $("#regEmail").val());
    }
    else {
        //document.getElementById("regNot").innerHTML = "Passwords do not match";
    }
}

function logIn() {    
    socket.emit("loginAttempt", $("#logUsername").val(), $("#logPassword").val());    
}

function loadMap() {
    var iduser = docCookies.getItem("iduser");
    socket.emit("loadMap", iduser);
}

function landClick() {
    var iduser = docCookies.getItem("iduser");
    socket.emit("landClick", iduser);
}

//Reg listeners
socket.on("regSuccess", function () {
    //document.getElementById("regNot").innerHTML = "Registration Successful!";
});

socket.on("regFail", function (data) {
    //document.getElementById("regNot").innerHTML = data;
});
//Reg listeners

//Login listeners
socket.on("loginSuccess", function (idu) {

    idu = idu + 0;
    docCookies.setItem("iduser", idu);

    window.location.href = "game.html";
});

socket.on("loginFail", function (data) {
    //document.getElementById("logInNot").innerHTML = data;
});
//Login listeners

//Map listeners
socket.on("loadMap", function (HLBiome) {

    //gets window width by using a supported method of the browser
    var w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

    //gets window height by using a supported method of the browser
    var h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

    document.getElementById("homeLand").style.backgroundImage = "url('" + HLBiome + "Spot.png')";
    //centers map on homeLand
    document.getElementById("mapArea").style.top = ((h / 2) - 472) + "px";
    document.getElementById("mapArea").style.left = ((w / 2) - 400) + "px";
});
//Map listeners

//Land listeners
socket.on("displayExtraLand", function (name, xcoord, ycoord, biome, pop, hap, topres, topim, topex, color) {//Appends each other land to land notBox, first is denoted by color = 1
    if (color === 1) {
        $("#landBodyDiv").append('<div class="dataSection dataSectionColorA"><div class="dataSectionTitle">Other Land Data</div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Name: ' + name + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Coords: X: ' + xcoord + ' &emsp;Y: ' + ycoord + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Biome: ' + biome + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Population: ' + pop + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Happiness: ' + hap + '</div></div><div class="dataCellBorder dataCellFullWidth"><div class="dataCell">Top Produced Resource: ' + topres + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Import: ' + topim + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Export: ' + topex + '</div></div></div>');
    }
    else if (color % 2 === 1) {
        $("#landBodyDiv").append('<div class="dataSection dataSectionColorA"><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Name: ' + name + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Coords: X: ' + xcoord + ' &emsp;Y: ' + ycoord + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Biome: ' + biome + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Population: ' + pop + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Happiness: ' + hap + '</div></div><div class="dataCellBorder dataCellFullWidth"><div class="dataCell">Top Produced Resource: ' + topres + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Import: ' + topim + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Export: ' + topex + '</div></div></div>');
    }
    else {
        $("#landBodyDiv").append('<div class="dataSection dataSectionColorB"><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Name: ' + name + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Coords: X: ' + xcoord + ' &emsp;Y: ' + ycoord + '</div></div><div class="dataCellBorder dataCellThirdWidth"><div class="dataCell">Biome: ' + biome + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Population: ' + pop + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Happiness: ' + hap + '</div></div><div class="dataCellBorder dataCellFullWidth"><div class="dataCell">Top Produced Resource: ' + topres + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Import: ' + topim + '</div></div><div class="dataCellBorder dataCellHalfWidth"><div class="dataCell">Top Export: ' + topex + '</div></div></div>');
    }
});
//Land listeners



//General listeners
socket.on("displayData", function (elem, data) {
    document.getElementById(elem).innerHTML = data;
});
//General listeners