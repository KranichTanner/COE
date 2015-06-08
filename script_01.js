var w = window.innerWidth   //gets window width by using a supported method of the browser
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight  //gets window height by using a supported method of the browser
|| document.documentElement.clientHeight
|| document.body.clientHeight;


window.onload = function () {
    //mapClick();
    //setComponentDim(w, 850, 850);
};

// function to getElementById
function getE(id){
  return document.getElementById(id);
}

function genPanel(panelid) {
    if (getE(panelid).src == "") {

        var canvas = getE("canvasMap");
        var ctx = canvas.getContext("2d");

        var mapPiece = new Image();
        mapPiece.src = "SampleMapSpot.png";
        var mapPiece2 = new Image();
        mapPiece2.src = "SampleMapSpot2.png";

        for (y = 0; y <= 850; y += 50) {
            for (x = 0; x <= 850; x += 50) {
                ctx.drawImage(mapPiece2, x, y);
            }
        }

        $("#" + panelid).attr("src", canvas.toDataURL("image/png"));
    }

}


