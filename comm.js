var socket = io.connect("http://localhost:3000");

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

//Land listeners
socket.on("displayData", function (elem, data) {
    document.getElementById(elem).innerHTML = data;
});
//Land listeners