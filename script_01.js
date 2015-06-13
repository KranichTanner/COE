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

        console.log("Panel should be painted " + new Date().toLocaleTimeString());

        var canvas = getE("canvasMap");
        var ctx = canvas.getContext("2d");

        var mapPiece = new Image();
        mapPiece.src = "SampleMapSpot.png";
        var mapPiece2 = new Image();
        mapPiece2.src = "SampleMapSpot2.png";

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

    }

}

function dataClick(dataid) {
    $("#notContent").empty();
    $("#notContent").load(dataid + ".html");
    getE("notContainer").setAttribute("style", "display:block; top:" + ((h / 2)-300) + "px; left:" + ((w / 2)-300) + "px;");

}

function notCloseClick() {
    getE("notContainer").setAttribute("style", "display:none;");
}
//Yes these are the same but mapClick may expand to more functions later and better to seperate now than later
function mapClick() {
    getE("notContainer").setAttribute("style", "display:none;");
}
