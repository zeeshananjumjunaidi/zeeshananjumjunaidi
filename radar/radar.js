

var width=1;
var height=1;
var mainColor;
var sector_radius=200;
function setup(){
    width = window.innerWidth;
    height=window.innerHeight;
    createCanvas(width,height);
    mainColor = color(40,250,10);
    sector_radius=width*0.1;
}

function draw(){
    background(30);
    noFill();
    stroke(mainColor);
    line(0,height/2,width,height/2);
    line(width/2,0,width/2,height);
    push();
    translate(width/2,height/2);
    circle(0,0,sector_radius);
    circle(0,0,2*sector_radius);
    circle(0,0,3*sector_radius);
    circle(0,0,3.5*sector_radius);
    circle(0,0,4*sector_radius);
    
    pop();
}