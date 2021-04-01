

var height = window.innerHeight;
var width = window.innerWidth;

var root;
function setup(){
    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    console.log(width,height);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    let segmentSize = 50;
    let current = Segment.createRootInstance(width/2,height/2,0,segmentSize,1);
    this.segments=[current];
    for(let i=0;i<4;i++){
        let st = Segment.createSegment(current,0,segmentSize,2+i);
        current.child = st;
        
        current= st;
    }
    root=current;
}

target = new p5.Vector(10,10);
function draw(){
    
    background(0x2e3d49);
    
    //let next = root;
   root.follow(mouseX,mouseY);
//     root.follow(target.x,target.y);
//  //   print(dist(root.b.x,root.b.y,target.x,target.y));
//     if(dist(root.b.x,root.b.y,target.x,target.y)<5){
//         target = new p5.Vector(random(0,1000),random(0,1000));
//     }
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
