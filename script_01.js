window.onload = function () {
    //mapClick();
    setComponentDim(1024, 850, 850);
};

// function to getElementById
function getE(id){
  return document.getElementById(id);
}

/*function paintMapSpot(x, y, img) {
    var ctx = getE("canvasMap").getContext("2d");
    ctx.beginPath();
    var mapPiece = new Image();
    mapPiece.onload = function () {
        ctx.drawImage(mapPiece, x, y);
    };
    mapPiece.src = img;//A 50px by 50px png image
    ctx.closePath();
}*/

//A simple function to easily resize components during development
function setComponentDim(bodyw, mapw, maph) {
    getE("divBody").setAttribute("style", "width:" + bodyw + "px");
    getE("contentArea").setAttribute("style", "height:" + maph + "px");
    getE("navList").setAttribute("style", "width:" + (bodyw - mapw) + "px");
    getE("mapBar").setAttribute("style", "width:" + mapw + "px");
}

/*function mapClick() {
    setComponentDim(1024, 850, 850);

    for (y = 0; y < 17; y++) {
        for (x = 0; x < 17; x++) {
            paintMapSpot(x * 50, y * 50, "SampleMapSpot.png");
        }
    }
    for (y = 850; y < 17; y++) {
        for (x = 850; x < 17; x++) {
            paintMapSpot(x * 50, y * 50, "SampleMapSpot2.png");
        }
    }

    //Replace with test clause to gen a new map section. Gen it. Merge section images into one. Save that image. Display needed pieces.
}*/
