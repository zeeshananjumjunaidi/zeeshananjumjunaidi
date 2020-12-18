
function setup(){
    print(innerWidth,innerHeight);
    createCanvas(innerWidth,innerHeight);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
}

function draw(){
    noCursor();
    translate(width/2,height/2);
    background(15,20,20);
    circle(mouseX-width/2,mouseY-height/2,10);
    stroke(100);
    noFill();
     rect(0,0,width-100,height-150);
}