function mapClick() {
    //Need to update map when clicked to make visible changes by other players
    document.getElementById("mapCol").innerHTML = "MAP";
}

function landsClick() {
    document.getElementById("mapCol").innerHTML = "LANDS_DATA";
}

function popClick() {
    document.getElementById("mapCol").innerHTML = "POPULATION_DATA";
}

function forrelClick() {
    document.getElementById("mapCol").innerHTML = "FOREIGN_RELATIONS_DATA";
}

function govClick() {
    document.getElementById("mapCol").innerHTML = "GOVERNMENT_DATA";
}

function infraClick() {
    document.getElementById("mapCol").innerHTML = "INFRASTRUCTURE_DATA";
}