

var height = window.innerHeight;
var width = window.innerWidth;
var obj1;
function setup(){    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    obj1 =new Kinematic2DObject(5,20);
}


function draw(){
    
    background(0x2e3d49);
    obj1.follow(mouseX,mouseY);
    obj1.update();
  
}
