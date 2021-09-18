
class Spacecraft {
    constructor(x, y, mass, sizeInRadius, vx = 0.01, vy = 0.200001) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.sizeInRadius = sizeInRadius;
        this.w = window.innerWidth / 2;
        this.h = window.innerHeight / 2;
        this.vel = new p5.Vector(vx, vy);
        this.destroyed = false;
    }
    draw() {
        if (this.destroyed) { fill(255, 0, 0); } else {
            fill(0, 0, 255);
        }
        circle(this.x, this.y, this.sizeInRadius);
        this.keepInbound();
    }
    /*
    gs: Gravity Source (i.e. Planet or any cellestial body)
    */
    simulate(gs) {
        if (this.destroyed) return;
        let d = dist(this.x, this.y, gs.x, gs.y);
        if (d < gs.radius / 2) { this.destroyed = true; return; }
        let g = 6.67 * (this.mass + gs.mass) / d ** 2;
        this.vel.add(g * (gs.x - this.x) / d / this.mass, g * (gs.y - this.y) / d / this.mass);
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.drawSimulationPath(gs);
    }
    drawSimulationPath(gs) {
        if (this.destroyed) return;
        let _x = this.x;
        let _y = this.y;
        let _vel = this.vel.copy();
        push();
        stroke(0)
        for (let i = 0; i < 100000; i += 1) {
            if (i % 100 == 0) {
                let d = dist(_x, _y, gs.x, gs.y);
                let g = 6.67 * (this.mass + gs.mass) / d ** 2;
                _vel.add(g * (gs.x - _x) / d / this.mass, g * (gs.y - _y) / d / this.mass);
                _x += _vel.x;
                _y += _vel.y;
                point(_x, _y);
            }
        }
        pop();
    }

    keepInbound() {
        fill(0)
        if (this.x < -this.w) { this.x = this.w * 2; }
        else if (this.x > this.w * 2) {
            this.x = -this.w;
        }
        if (this.y < -this.h) { this.y = this.h * 2; }
        else if (this.y > this.h * 2) {
            this.y = -this.h;
        }
    }
}