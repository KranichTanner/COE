window.onload = function () {
    mapClick();
};

// function to getElementById
function getE(id){
  return document.getElementById(id);
}

function paintMapSpot(x, y) {
    var ctx = getE("canvasMap").getContext("2d");
    var mapPiece = new Image();
    mapPiece.onload = function () {
        ctx.drawImage(mapPiece, x, y);
    };
    mapPiece.src = "SampleMapSpot.png";//A 50px by 50px png image
}

function setComponentDim(bodyw, mapw, maph) {
    getE("divBody").setAttribute("style", "width:" + bodyw + "px");
    getE("contentArea").setAttribute("style", "height:" + maph + "px");
    getE("navList").setAttribute("style", "width:" + (bodyw - mapw) + "px");
    getE("mapBar").setAttribute("style", "width:" + mapw + "px");
    getE("canvasMap").width = mapw;
    getE("canvasMap").height = maph;
}

function mapClick() {
    setComponentDim(1024, 850, 850); //A simple function to easily resize components during development

    for (y = 0; y < 17; y++) {
        for (x = 0; x < 17; x++) {
            paintMapSpot(x * 50, y * 50);
        }
    }
}
