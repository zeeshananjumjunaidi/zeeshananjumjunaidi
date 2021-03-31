

var height = window.innerHeight;
var width = window.innerWidth;

function setup(){
    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    console.log(width,height);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    let current = Segment.createRootInstance(width/2,height/2,0,150);
    this.segments=[current];
    for(let i=0;i<3;i++){
        let st = Segment.createSegment(current,0,150);
        this.segments.push(st);
        current= st;
    }
}
// let segments =[];
// let seg1 = Segment.createRootInstance(width/2,height/2,0,150);
// let seg2 = Segment.createSegment(seg1,45,150);
function draw(){
    // translate(width/2,height/3);
    background(0x2e3d49);
    // seg1.angle+=deltaTime*0.0008;
    segments[0].follow(mouseX,mouseY);
    let n=0;
    for(let i=0;i<segments.length;i++){
        let s = segments[i];
        s.follow()
        s.update();
        s.show();
        n=i;
    }
}
