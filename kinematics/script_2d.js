

var height = window.innerHeight;
var width = window.innerWidth;
var roboticHand;
function setup(){    
    width = window.innerWidth;
    height = window.innerHeight;    
    createCanvas(width,height);        
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    roboticHand= new Kinematic2DObject(random(0,width),random(0,height),1,150,3);    
}


function draw(){    
    background('#EEEEEE');
    push();
    roboticHand.update();
    pop();
}
