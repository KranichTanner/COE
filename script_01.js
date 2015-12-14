// function to getElementById
function getE(id){
  return document.getElementById(id);
}

//sets images to be used to an image object, effectively loading it into the cache to preload it for later
function preloadImages() {

    imgObj = [];

    imgSrc = [];
    imgSrc[0] = "DesertSpot.png";
    imgSrc[1] = "ForestSpot.png";

    for (x = 0; x < imgSrc.length; x++) {
        imgObj[x] = new Image();
        imgObj[x].src = imgSrc[x];

        console.log("Image " + x + " loaded");

    }

}

//Makes the notification boxes draggable, without having the inner components also draggable
function makeDraggable() {
    $("#mapArea, #notContainer").draggable({
        cancel: "#notContent, #notClose",
    });
}

//Used when a data button is clicked to bring up the correct notification box
function dataClick(dataid) {

    //gets window width by using a supported method of the browser
    var w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

    //gets window height by using a supported method of the browser
    var h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

    //Clears last content of notification box
    $("#notContent").empty();
    $("#notTitle").empty();
    //Loads content of data page into content area of notification box
    $("#notContent").load(dataid + ".html");
    //Positions notification box in the center-ish of the page
    getE("notContainer").setAttribute("style", "display:block; top:" + ((h / 2)-300) + "px; left:" + ((w / 2)-300) + "px;");

}

//Just makes the notification box invisible, effectively clearing it from the screen
//Does clear or empty content to possibly allow for time savings if user selects same option again
function notCloseClick() {
    getE("notContainer").style.display = "none";
}

//When map data button is clicked
//Sets notification to be invisible, centers current land to screen
function mapClick() {

    //gets window width by using a supported method of the browser
    var w = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

    //gets window height by using a supported method of the browser
    var h = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

    getE("notContainer").style.display = "none";
    //centers map on homeLand/current land
    document.getElementById("mapArea").style.top = ((h / 2) - 472) + "px";
    document.getElementById("mapArea").style.left = ((w / 2) - 400) + "px";
}

function dropDown(id) {
    alert("HI");
}