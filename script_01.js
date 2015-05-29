window.onload = function () {
    mapClick();
};

function paintMapSpot(x, y) {
    var ctx = document.getElementById("canvasMap").getContext("2d");
    var mapPiece = new Image();
    mapPiece.onload = function () {

        ctx.drawImage(mapPiece, x, y);
    };
    mapPiece.src = "SampleMapSpot.png";//A 50px by 50px png image
}

function setComponentDim(bodyw, mapw, maph) {
    document.getElementById("divBody").setAttribute("style", "width:" + bodyw + "px");
    document.getElementById("contentArea").setAttribute("style", "height:" + maph + "px");
    document.getElementById("navList").setAttribute("style", "width:" + (bodyw - mapw) + "px");
    document.getElementById("mapBar").setAttribute("style", "width:" + mapw + "px");
    document.getElementById("canvasMap").width = mapw;
    document.getElementById("canvasMap").height = maph;
}

function mapClick() {

    setComponentDim(1024, 850, 850); //A simple function to easily resize components during development

    for (y = 0; y < 17; y++) {
        for (x = 0; x < 17; x++) {
            paintMapSpot(x * 50, y * 50);
        }
    }
}
