
class Kinematic2DObject {
    constructor(x, y, index, segmentSize = 200, segmentCount = 3) {
        this.x =x;
        this.y =y;
        this.index = index;
        this.segmentCount=segmentCount;
        this.segments = [];
        this.base =new p5.Vector(width/2,height);
        this.segments.push(Segment.createRootInstance(300,300,Math.PI/2,segmentSize,-1));
        for(let i=1;i<segmentCount;i++){
            this.segments.push(Segment.createSegment(Math.PI,segmentSize,i));

        }
        this.target = new p5.Vector();
    }
 
    follow(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
    update() {
        let total = this.segments.length;
        let end = this.segments[total-1];
        end.follow(mouseX,mouseY);
        end.update();
       // end.show();
        for (let i=total-2;i>=0;i--){
            let next = this.segments[i];
            next.followChild(this.segments[i+1]);
            next.update();
          //  next.show();
        }
        this.segments[0].setA(this.base);
        for(let i=1;i<this.segmentCount;i++){
            this.segments[i].setA(this.segments[i-1].b);
        }

        for(let i=0;i<this.segmentCount;i++){
            this.segments[i].show();
        }
    }
}