
// Gravity Assit / Slingshot / Oberth maneuver
// Paper reference: http://symbolaris.com/course/fcps16/projects/amoran.pdf
// We 'll implement simulation of powered and unpowered gravity assits

var gravitySource;
var spacecraft;
var width;
var height;
function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    rectMode(CENTER)

    gravitySource = new GravitySource(0, 0, 10e4, 100);
    spacecraft = new Spacecraft(-width/2.5, 0, 10, 20);
}

function draw() {
    translate(width/2,height/2);
    background(255);
    noStroke();
    fill(0);
    gravitySource.draw();
    spacecraft.draw();
}