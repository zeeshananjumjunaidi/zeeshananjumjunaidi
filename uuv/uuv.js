class UUV {
    constructor(x, y, heading, debug = true) {
        this.position = new p5.Vector(x, y);
        this.heading = heading;
        this.power = 0;
        this.debug = debug;
        this.target = null;
        this.deltaSteerVel=0;
    }

    setTarget(t) {
        this.target = t;
    }
    draw() {
        push();
        stroke(50, 0, 0);
        fill(250, 150, 0);
        this.position.x += (Math.cos(this.heading) * this.power);
        this.position.y += (Math.sin(this.heading) * this.power);
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        rect(-45, 0, 25, 15);
        rect(0, 0, 100, 20, 5, 100, 100, 5);
        rect(0, 0, 25, 25);
        if (this.debug) {
            this.drawDebug();
        }
        pop();
    }
    drive(power, steering) {
        // this.position.y-=2;
        if (!this.target) {
            this.heading += steering;
        } else if (dist(this.target.x, this.target.y, this.position.x, this.position.y) > 100) {
            this.power = power;
            let dir = p5.Vector.sub(this.target, this.position);
            dir.normalize();
            // let rotateAmount = p5.Vector.cross (dir).y;
            let angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
            // angle = Math.max(angle,0);
            // angle = Math.min(angle,Math.PI*2);
            if(this.deltaSteerVel<=1){
                this.deltaSteerVel+=0.0021;
            }else{this.deltaSteerVel=0;}
            // if(angle<0){
            //     angle =Math.PI*2 +angle;
            // }
            this.heading = lerp(this.heading, angle, this.deltaSteerVel);
            // this.heading= constrain(this.heading,-Math.PI*2,Math.PI*2);
            // this.heading= map(this.heading,-Math.PI*2,Math.PI*2,-Math.PI*2,Math.PI*2);
            text(angle.toFixed(2), 100, 100);
            let d = dist(this.target.x, this.target.y, this.position.x, this.position.y);
            text(d.toFixed(2),100,150);
        } else { this.power *=0.99; 
        text("Target Reached",100,100);
        }
    }
    drawDebug() {
        noFill();
        stroke(255, 0, 0);
        line(0, 0, 100, 0);
        text('x', 120, 0);
        stroke(0, 255, 0);
        text('y', 0, 120);
        line(0, 0, 0, 100);
        stroke(0);
        noFill();
        circle(0, 0, 200);
    }
}