//gets window width by using a supported method of the browser
var w = window.innerWidth||
        document.documentElement.clientWidth||
        document.body.clientWidth;

//gets window height by using a supported method of the browser
var h = window.innerHeight||
        document.documentElement.clientHeight||
        document.body.clientHeight;


window.onload = function () {
    //mapClick();
    //setComponentDim(w, 850, 850);
};

// function to getElementById
function getE(id){
  return document.getElementById(id);
}

function genPanel(panelid) {
    if (getE(panelid).src === "") {

        var canvas = getE("canvasMap");
        var ctx = canvas.getContext("2d");

        var mapPiece = new Image();
        mapPiece.src = "SampleMapSpot.png";
        var mapPiece2 = new Image();
        mapPiece2.src = "SampleMapSpot2.png";

        $(document).ready(function () {//Checks if the whole document is loaded so may need to change if it's too slow, just need to see if images are loaded.

            for (y = 0; y <= 850; y += 50) {
                for (x = 0; x <= 850; x += 50) {
                    var rand = Math.round((Math.random() + 1));
                    if (rand === 1) {
                        ctx.drawImage(mapPiece, x, y);
                    }
                    else {
                        ctx.drawImage(mapPiece2, x, y);
                    }
                }
            }

            $("#" + panelid).attr("src", canvas.toDataURL("image/png"));
        });
    }

}
