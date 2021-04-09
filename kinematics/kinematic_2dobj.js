
class Kinematic2DObject {
    constructor(x, y, index, segmentSize = 200, segmentCount = 3) {
        this.x =x;
        this.y =y;
        this.index = index;
        this.segmentCount=segmentCount;
        this.segments = [];
        this.base =new p5.Vector(width/2,height-50);
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
        line(0,height-50,width,height-50);
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
        this.drawDebug();
    }
    drawDebug(){
        noFill();
        let eeBx=this.segments[this.segmentCount-1].b.x;
        let eeBy=this.segments[this.segmentCount-1].b.y;
        let groundVector = new p5.Vector(width/2,height-50);
        let vc = p5.Vector.sub(new p5.Vector(eeBx,eeBy),groundVector);
        let angle = Math.atan2(groundVector.y-eeBy,groundVector.x-eeBx);
        line(eeBx,eeBy,
            eeBx,height-50);
        line(0,this.segments[this.segmentCount-1].b.y,eeBx,
            eeBy);
        // arc(width/2,height-50,vc.mag()*2,vc.mag()*2,-180,0);

        arc(width/2,height-50,vc.mag()*2,vc.mag()*2,-180,180+angle*180/Math.PI);


    }
}