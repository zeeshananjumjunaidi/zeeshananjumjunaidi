class Segment {
    static createRootInstance(x, y, _angle, len_, index = 0) {
        return new Segment(x, y, _angle, len_, index);
    }
    static createSegment(_angle, len_, index = 0) {
        let seg = new Segment(0, 0,
            _angle, len_, index);
       //seg.parent = parentSegment;
        // seg.follow(parentSegment.x,parentSegment.y);
        return seg;

    }
    constructor(x, y, _angle, len_, index) {
      //  this.parent = null;
      
        this.link_img = loadImage('link_2d.png');
        this.joint_img = loadImage('joint_2d.png');
        
        this.link_img.resize(len_/2, len_);
        this.a = new p5.Vector(x, y);
        this.angle = _angle;
        this.len = len_;
        this.b = new p5.Vector(x, y);
        this.child = null;
        this.index = index;
        this.calculateB();
    }

    followChild(child) {
        let tX = child.a.x;
        let tY = child.a.y;
        
        this.follow(tX, tY);
    }
    follow(fx, fy) {

        let target = new p5.Vector(fx, fy);
        let dir = p5.Vector.sub(target, this.a);        
        this.angle = dir.heading();
        dir.setMag(this.len);
        dir.mult(-1);
        this.a = p5.Vector.add(target, dir);
    }

    setA(pos){
        this.a = pos.copy();
        this.calculateB();
    }

    calculateB() {  
        this.b.x = this.a.x + (this.len * Math.cos(this.angle));
        this.b.y = this.a.y + (this.len * Math.sin(this.angle));
    }
    update() {
        this.calculateB();
    }
    show() {
        strokeWeight(1)
        circle(this.a.x,this.a.y,20);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
       // let angle = Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);
        let angle = Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x);
        // find center point of a & b
        let cx = (this.a.x+this.b.x)/2;
        let cy = (this.a.y+this.b.y)/2;
        push();      
        translate(cx,cy);
        scale(0.5);
        rotate(angle*180/Math.PI-90);  
        image(this.link_img,0,0,this.len/3,2*this.len);
        pop();
        translate(this.a.x,this.a.y);
        scale(0.5);
        rotate(angle*180/Math.PI-90);  
        image(this.joint_img,0,0);
        pop();
        push();

     
        this.showDebug();
    }
    showDebug(){
        
    }

}