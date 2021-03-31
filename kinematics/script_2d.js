

var height = window.innerHeight;
var width = window.innerWidth;


function setup(){
    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    console.log(width,height);
    rectMode(CENTER);
    imageMode(CENTER);
}

var j1=new p5.Vector(0,0);
var eE=new p5.Vector(100,0);
function draw(){
    translate(width/2,height/2);
    background(0x2e3d49);
    push();
    translate(j1.x,j1.y);
    circle(0,0,20);
    // endeffector
    translate(eE.x,eE.y);
    circle(0,0,20);
    pop();    
    line(j1.x,j1.y,eE.x,eE.y);
}