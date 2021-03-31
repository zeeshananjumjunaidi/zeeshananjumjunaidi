class Segment{
    static createRootInstance(x,y,_angle,len_){
        return new Segment(x,y,_angle,len_);
    }
    static createSegment(parentSegment,_angle,len_){
        let seg = new Segment(parentSegment.b.x,parentSegment.b.y,_angle,len_);
        // seg.follow(parentSegment.x,parentSegment.y);
        return seg;
        
    }
    constructor(x,y, _angle,len_){
        this.parent =null;
        this.a = new p5.Vector(x,y);
        this.angle = _angle;
        this.len = len_;
        this.b = new p5.Vector(x,y);
        this.calculateB();
    }    


    follow(fx,fy){
        let target = new p5.Vector(fx,fy);
        let dir = p5.Vector.sub(target,this.a);
        this.angle = dir.heading();
        dir.setMag(this.len);
        dir.mult(-1);
        this.a = p5.Vector.add(target,dir);
    }
    calculateB(){
        this.b.x=this.a.x+(this.len*Math.cos(this.angle));
        this.b.y=this.a.y+(this.len*Math.sin(this.angle));
    }
    update(){
        this.calculateB();
    }
    show(){
        stroke(0);
        strokeWeight(4);
        line(this.a.x,this.a.y,this.b.x,this.b.y);
    }

}