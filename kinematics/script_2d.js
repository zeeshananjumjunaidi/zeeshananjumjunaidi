

var height = window.innerHeight;
var width = window.innerWidth;
var root;

function setup(){    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);

    let segmentSize = 5;
    let counts = 20;
    let current = Segment.createRootInstance(width/2,height/2,0,segmentSize,1);
    this.segments=[current];
    for(let i=0;i<counts;i++){
        let st = Segment.createSegment(current,0,segmentSize,2+i);
        current.child = st;
        
        current= st;
    }
    root=current;
}

target = new p5.Vector(10,10);

function draw(){
    
    background(0x2e3d49);
    
   root.follow(mouseX,mouseY);

    root.update();
    root.show();
    let next=root.parent;
    while(next!=null){
        next.followChild();
        next.update();
        next.show();
        next=next.parent;
    }    
}
