// function to getElementById
function getE(id){
  return document.getElementById(id);
}

//sets images to be used to an image object, effectively loading it into the cache to preload it for later
function preloadImages() {

    imgObj = [];

    imgSrc = [];
    imgSrc[0] = "DesertSpot.png";

    for (x = 0; x <= 0; x++) {
        imgObj[x] = new Image();
        imgObj[x].src = imgSrc[x];

        console.log("Image " + x + " loaded");

    }

}

function makeDraggable() {
    $("#mapArea, #notContainer").draggable({
        cancel: "#notContent, #notClose",
    });
}

function dataClick(dataid) {

    //gets window width by using a supported method of the browser
    var w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

    //gets window height by using a supported method of the browser
    var h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

    $("#notContent").empty();
    $("#notTitle").empty();
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
