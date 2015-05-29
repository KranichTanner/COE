window.onload = function(){
    setComponentDim(1024, 850, 850);
};

function setComponentDim(bodyw, mapw, maph) {
    document.getElementById("divBody").setAttribute("style", "width:" + bodyw + "px");
    document.getElementById("contentArea").setAttribute("style", "height:" + maph + "px");
    document.getElementById("navList").setAttribute("style", "width:" + (bodyw - mapw) + "px");
    document.getElementById("mapBar").setAttribute("style", "width:" + mapw + "px");
    document.getElementById("canvasMap").width = mapw;
    document.getElementById("canvasMap").height = maph;
}
