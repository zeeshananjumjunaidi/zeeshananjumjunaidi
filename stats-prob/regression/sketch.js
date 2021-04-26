

const width = window.innerWidth;
const height = window.innerHeight;
const divider = 40;
const PARTICLE_COUNT = 2;
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
    LRModel = calculateLR();
    console.log(LRModel);

}var LRModel;
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
    if(LRModel){
        // y = (x * LRModel.slope) + LRModel.intercept
        let x = 1
        let y=  (x * LRModel.slope) + LRModel.intercept;
        let x1 = 200
        let y1=  (x1 * LRModel.slope) + LRModel.intercept;
        circle(x,y,15);
        circle(x1,y1,15);
    }
}
function calculateLR(){
        var model = {};
        var n = data.length;
        var sumX = 0;
        var sumY = 0;
        var sumXy = 0;
        var sumXx = 0;
        var sumYy = 0;

        for (let i = 0; i < n; i++) {
            let x = data[i][0];
            let y = data[i][1];
            sumX += x;
            sumY += y;
            sumXy += (x*y);
            sumXx += (x*x);
            sumYy += (y*y);
        } 

        model['slope'] = (n * sumXy - sumX * sumY) / (n*sumXx - sumX * sumX);
        model['intercept'] = (sumY - model.slope * sumX)/n;
        model['r2'] = Math.pow((n*sumXy - sumX*sumY)/Math.sqrt((n*sumXx-sumX*sumX)*(n*sumYy-sumY*sumY)),2);

        return model;
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