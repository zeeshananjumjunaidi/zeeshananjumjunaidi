


var uuv;
var target;
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER);
    target = new p5.Vector(0,0);
    uuv = new UUV(500, 500, 0);
    uuv.setTarget(target);
}

function draw() {
   // translate(window.innerWidth / 2, window.innerHeight / 2);
    background(100, 100, 150);
    target.x=mouseX;//-(window.innerWidth / 2);
    target.y=mouseY;//-(window.innerHeight / 2);
    uuv.draw();
    uuv.drive(1, 0.01);
    noCursor();
    fill(255,0,0);
    circle(target.x,target.y,20);
}