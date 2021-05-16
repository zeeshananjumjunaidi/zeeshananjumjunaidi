

var width=1;
var height=1;
var mainColor;
var radar={
    angle:0,
    range:400
}
var targets=[];

function setup(){
    width = window.innerWidth;
    height=window.innerHeight;
    createCanvas(width,height);
    mainColor = color(40,250,10);
    sector_radius=width*0.1;
    targets.push(new Target(0,0,Math.PI/4,2));
}

function draw(){
    background(30);
    noFill();
    stroke(mainColor);
    line(0,height/2,width,height/2);
    line(width/2,0,width/2,height);
    push();
    translate(width/2,height/2);
    drawBackground();
    drawScanner();
    pop();
    drawTargets();
    if(radar.angle>2*Math.PI){radar.angle=0;}else{radar.angle+=0.001*deltaTime;}
}
function drawTargets(){
    noStroke();
    fill(255,0,0,150);
    for(let i=0;i<targets.length;i++){
        targets[i].draw();
    }
}
function drawScanner(){
   
    for(let i=0;i<Math.PI*2;i+=0.1){
        stroke(40,250,10,50);
        line(0,0,Math.cos(i)*radar.range,Math.sin(i)*radar.range);
        fill(40,250,10,150);
        noStroke();
        text(i.toFixed(2),Math.cos(i)*radar.range,Math.sin(i)*radar.range);
    }
    stroke(40,250,10,120);
    line(0,0,Math.cos(radar.angle)*radar.range,Math.sin(radar.angle)*radar.range);
  
}

function drawBackground(){
    circle(0,0,radar.range*0.5);
    circle(0,0,radar.range);
    circle(0,0,radar.range*1.5);
    circle(0,0,radar.range*2);
}