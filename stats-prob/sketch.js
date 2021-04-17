

const width = window.innerWidth;
const height = window.innerHeight;
let data=[];
function setup(){
    createCanvas(width,height);
    imageMode(CENTER);
    rectMode(CENTER);
    for(let i=-500;i<500;i++){
        data.push(random()*i);
    }
}
function draw(){
    background(255);
    translate(width/2,height/2);
    circle(0,0,20);
    push();
    fill(255,0,0); stroke(255,0,0);
    for(let i=0;i<data.length;i++){
        circle(data[i],i,2);
    }
    pop();
}