var socket;

$(document).ready(function () {
    socket = io.connect("http://localhost:3000");
});

function logIn(user, pass) {
    socket.emit("loginUsername", user);

    socket.on("loginPassword", function (data) {
        if (data === true) {
            socket.emit("loginPassword", pass);
        }
        else {
            socket.emit("loginFail");
        }
    });

    socket.on("loginSuccess", function (data) {
        if (data === true) {
            socket.emit("loginSuccess");
            $("body").empty();
            $("body").load("game.html");
        }
        else {
            socket.emit("loginFail");
        }
    });

    socket.on("loginFail", function () {
    });
}

function landClick() {
    socket.emit("landAllGovData");

    socket.on("landAllGovData", function (data) {
        document.getElementById("landAllGovData").innerHTML = data;
    });
}