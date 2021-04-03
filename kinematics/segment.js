class Segment {
    static createRootInstance(x, y, _angle, len_, index = 0) {
        return new Segment(x, y, _angle, len_, index);
    }
    static createSegment(parentSegment, _angle, len_, index = 0) {
        let seg = new Segment(parentSegment.b.x, parentSegment.b.y,
            _angle, len_, index);
        seg.parent = parentSegment;
        // seg.follow(parentSegment.x,parentSegment.y);
        return seg;

    }
    constructor(x, y, _angle, len_, index) {
        this.parent = null;
        this.a = new p5.Vector(x, y);
        this.angle = _angle;
        this.len = len_;
        this.b = new p5.Vector(x, y);
        this.child = null;
        this.index = index;
        this.calculateB();
    }

    followChild() {
        let tX = this.child.a.x;
        let tY = this.child.a.y;
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
    calculateB() {
        this.b.x = this.a.x + (this.len * Math.cos(this.angle));
        this.b.y = this.a.y + (this.len * Math.sin(this.angle));

        // If Gravity
        // this.a.y+=9.8;
    }
    update() {
        this.calculateB();
    }
    show() {
        stroke(0);
        fill(0);
        // let size = 4*this.index/100;
        // size = size>200?200:size;
        let size = 5;
         size = 4*this.index/100;
        strokeWeight(size);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        fill(255,0,0);
        strokeWeight(1);
        //circle(this.a.x, this.a.y, 10);
        if (this.child == null) {
      
         //   circle(this.b.x, this.b.y, 10);

        }
    }

}