

var width=window.innerWidth;
var height = window.innerHeight;

// Element
var pEle = document.querySelector('#pEle');
var iEle = document.querySelector('#iEle');
var dEle = document.querySelector('#dEle');
var setPointEle = document.querySelector('#setPointEle');


// PID
var t = 0;
// var pid =new PID(0.2,0.0002,0.02,t);
//var pid =new PID(0.1,0.00062,0.0001,t);
var pid =new PID(0.01,0.00001,0.0001,t);
var twiddle = new Twiddle(pid);
var currentValue = 4;
var setPoint = 2;
var L = 50;
var cY = [];
var sY = [];
var tX = [];
var yOffset=height/2;
function setup(){        
    // frameRate(12)
    width=window.innerWidth;
    height = window.innerHeight;    
    yOffset=height/2;
    createCanvas(width,height);
    pid.setPoint=setPoint;
    L = round(width)-50;
    for(let i=0;i<L;i++){
        tX.push(i);
    }
}

function draw(){
    translate(0,height/2);
    t++;
    background(220);
    strokeWeight(0.5);
    line(0,0,width,0);
    line(width/2,-height,width/2,height);

    strokeWeight(1);

    color(0);
    setPoint=mouseY- height/2;
    line(0,setPoint,width,setPoint);
    text((-pid.setPoint).toFixed(2),width/2+30,setPoint-10);
    pidUpdate();
    if(cY.length>2){
        push();
        stroke(255,0,0);
        fill(255,0,0);
        
        var i=1;
        for(i=1;i<cY.length;i++){
            line(tX[i-1],cY[i-1],tX[i],cY[i]);
            last = i;
            // text(i,tX[i-1]/100*width,cY[i-1]*10);
            // text(`${tX[i-1]/100*width}, ${cY[i-1]*10}, ${tX[i]/100*width}, ${cY[i]*10}`,10,i*20);
        }
        // console.log(tX[i-1],cY[i-1]);
        circle(tX[i-2],cY[i-2],5);
        text(currentValue.toFixed(2), tX[i-1]-50,cY[i-1]);
        pop();
    }
    cY = cY.slice(-L);
    sY = sY.slice(-L);
    tX = tX.slice(-L);
    
    displayStats();
}
var cL=0;
function pidUpdate() {
    pid.setPoint=setPoint;
    pid.update(currentValue,t+=0.1);
    currentValue+=pid.output;
    cY.push(currentValue);
    sY.push(pid.setPoint);

    let c =  twiddle.update();
    pid.kP = c[0];
    pid.kI = c[1];
    pid.kD = c[2];
}
function displayStats(){
    text(`P = ${pid.kP}`,10,20);
    text(`I = ${pid.kI}`,10,35);
    text(`D = ${pid.kD}`,10,50);
}