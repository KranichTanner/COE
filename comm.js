var socket = io.connect("http://localhost:3000");;

function logIn(user, pass) {
    socket.emit("loginAttempt", user, pass);
}

function landClick() {
    socket.emit("landAllGovData");
}

//Login listeners
socket.on("loginSuccess", function (data) {
    if (data === true) {
        socket.emit("loginSuccess");
        $("body").empty();
        $("body").load("game.html", function () {
            $("#panelArea, #notContainer").draggable({
                cancel: "#notContent, #notClose",
                //containment will stop items from being dragged outside a bound or element, but this drag field has to be larger than the dragged element to prevent strange behavior
            });
        });
    }
    else {
        socket.emit("loginFail");
    }
});

socket.on("loginFail", function () {
});
//Login listeners

//Land listeners
socket.on("landAllGovData", function (data) {
    document.getElementById("landAllGovData").innerHTML = data;
});
//Land listeners