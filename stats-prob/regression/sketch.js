

const width = window.innerWidth;
const height = window.innerHeight;
const divider = 40;
const PARTICLE_COUNT = 200;
let data = [];
class Line{
    constructor(a,b,c,d){
        this.x1=a;this.y1=b;
        this.x2=c;this.y2=d;
    }
    udpateRegressionCoeff(){
        // yi =f(x,B) + ei
    }
}
let width2 = width / 2;
let height2 = height / 2;
let regressionLine;
function setup() {
    createCanvas(width, height);
    imageMode(CENTER);
    rectMode(CENTER);
    console.log("Regression");

    for(let i=-width2;i<width2;i+=divider){
        for(let j=-height2;j<height2;j+=divider){
            if(data.length>PARTICLE_COUNT){break;}
            if(random()>0.5)
            data.push([random()*i,random()*j*0.4]);
        }
    }
    regressionLine = new Line(-width2,-height2,width2,height2);
}
function draw() {
    background(255);
    strokeWeight(1);
    stroke(0);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);
    translate(width / 2, height / 2);
    for(let i=0;i<data.length;i++){
        circle(data[i][0],data[i][1],2);
    }
    drawRegressionLine();
    drawError();
    calculateSE
}

function drawRegressionLine(){
    stroke(255,0,0);
    line(regressionLine.x1,regressionLine.y1,regressionLine.x2,regressionLine.y2);
}
function drawError(){
    strokeWeight(0.5);
    for(let i=0;i<data.length;i++){
        let d= data[i];
        let y = d[1];
        if((regressionLine.x2-regressionLine.x1)!=0){
        let m = (regressionLine.y2-regressionLine.y1)/(regressionLine.x2-regressionLine.x1);
        // y = mx + b, b=  0
        // x =y/m
        let x = y/m;
        circle(x,y,2);
        line(x,y,d[0],d[1]);
        }
    }
}