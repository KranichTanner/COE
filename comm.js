var socket = io.connect("http://localhost:3000");

function register(user, pass, email) {
    document.getElementById("regNot").innerHTML = "";
    socket.emit("regAttempt", user, pass, email);
}

function logIn(user, pass) {
    socket.emit("loginAttempt", user, pass);
}

function landClick() {
    socket.emit("landAllGovData");
}

//Reg listeners
socket.on("regSuccess", function () {
    document.getElementById("regNot").innerHTML = "Registration Successful!";
});

socket.on("regFail", function (data) {
    document.getElementById("regNot").innerHTML = data;
});
//Reg listeners

//Login listeners
socket.on("loginSuccess", function () {
    $("body").empty();
    $("body").load("game.html", function () {
        $("#panelArea, #notContainer").draggable({
            cancel: "#notContent, #notClose",
            //containment will stop items from being dragged outside a bound or element, but this drag field has to be larger than the dragged element to prevent strange behavior
        });
    });
});

socket.on("loginFail", function (data) {
    document.getElementById("logInNot").innerHTML = data;
});
//Login listeners

//Land listeners
socket.on("landAllGovData", function (data) {
    document.getElementById("landAllGovData").innerHTML = data;
});
//Land listeners