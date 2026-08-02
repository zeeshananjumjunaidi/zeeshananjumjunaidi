class Ray {

    constructor(positonRef, angle, range = 100) {
        this.pos = positonRef;
        this.dir = p5.Vector.fromAngle(angle);
        this.range = range;
    }
    show() {
        // stroke(255, 10);
        this.update();
    }
    update(){
        push();
        translate(this.pos.x, this.pos.y);
        // fill(255);
        line(0, 0, this.dir.x * this.range, this.dir.y * this.range);
        pop();
    }
    cast(wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom == 0) { return false; }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        if (t > 0 && t < 1 && u > 0) {
            let pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        }
        return false;

    }
    lookAt(x, y) {
        this.dir.x = x;// - this.pos.x;
        this.dir.y = y;// - this.pos.y;
        this.dir.normalize();
    }
}