window.onload = function () {
    for (y = 0; y < 10; y++){
        for(x = 0; x < 10; x++){
            paintMap(x * 50, y * 50);
        }
    }
}

function paintMap(x, y) {
    var ctx = document.getElementById("canvasMap").getContext("2d");
    var mappiece = new Image();
    mappiece.onload = function () {

        ctx.drawImage(mappiece, x, y);//Produces a warped image on screen, possibly due to percents in formatting
    }
    mappiece.src = "SampleMapSpot.png";//A 50px by 50px png image
}