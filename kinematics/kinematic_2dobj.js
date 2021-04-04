
class Kinematic2DObject {
    constructor(segmentSize=5,segmentCount=20){
    this.segmentSize = segmentSize;
    this.segmentCount = segmentCount;
    let current = Segment.createRootInstance(width / 2, height / 2, 0, segmentSize, 1);

    for (let i = 0; i < segmentCount; i++) {
        let st = Segment.createSegment(current, 0, segmentSize, 2 + i);
        current.child = st;
        current = st;
    }
    this.root = current;
    this.target = new p5.Vector(10, 10);
}
follow(x,y){
    this.target.x = x;
    this.target.y = y;
}
update(){
    this.root.follow(this.target.x,this.target.y);
    this.root.update();
    this.root.show();
    let next = this.root.parent;
    while (next != null) {
        next.followChild();
        next.update();
        next.show();
        next = next.parent;
    }
}
}