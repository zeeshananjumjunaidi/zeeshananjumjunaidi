

const width = window.innerWidth;
const height = window.innerHeight;
const divider = 40;
const PARTICLE_COUNT = 1;
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
    // drawRegressionLine();
    // drawError();
    if(LRModel){
        strokeWeight(2);
        stroke(0,255,50);
        fill(0)
        let endIndex=LRModel[0].length-1;
        for(let i=0;i<LRModel[0].length;i++){
            circle(LRModel[0][i],LRModel[1][i],5);
        }
        let x1=LRModel[0][0];
        let y1=LRModel[1][0];
        let x2=LRModel[0][endIndex];
        let y2=LRModel[1][endIndex];

        let m2 = (y2-y1)/(x2-x1);
      //  let dFactor = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        let dx = (x2-x1);///dFactor;
        let dy = (y2-y1);//dFactor;
        let xn1 = -dx*width/2;
        let yn1 = -dy*height/2;
        let xn2 = dx*width/2;
        let yn2 = dy*height/2;

        // regressionLine.x1=xn1;
        // regressionLine.y1=yn1;
        // regressionLine.x2=xn2;
        // regressionLine.y2=yn2;
        stroke(255,0,255);
        strokeWeight(3)
        line(x1+xn1,y1+yn1,x2+xn2,y2+yn2);
    
    }
}

// Reference: https://dracoblue.net/dev/linear-least-squares-in-javascript/
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

        var result_values_x = [];
        var result_values_y = [];
        let m = model['slope'];
        let b = model['intercept'];
        for (var v = 0; v< n; v++) {
            x = data[v][0];
            y = x * m + b;
            result_values_x.push(x);
            result_values_y.push(y);
        }
    
        return [result_values_x, result_values_y];
       // return model;
}
function drawRegressionLine(){
    stroke(255,0,0);
    line(regressionLine.x1,regressionLine.y1,regressionLine.x2,regressionLine.y2);
}
function drawError(){
    strokeWeight(0.5);
    stroke(255,255,0);
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
function mousePressed(){
    let x=mouseX-width2;
    let y=mouseY-height2;
    let removed=false;
    for(let i=0;i<data.length;i++){
        if (dist(x,y,data[i][0],data[i][1])<20){
            data.splice(i,1);removed=true;
            break;
        }
    }
    if(!removed)
    data.push([x,y]);
    LRModel = calculateLR(); 
}