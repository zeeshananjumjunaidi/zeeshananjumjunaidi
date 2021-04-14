
class Particle {

    constructor(x, y, angle) {
        this.measurements = [];
        this.pos = createVector(x, y);
        this.dir = p5.Vector.fromAngle(angle);
        this.normalizeAngle();
        this.dir.normalize();
        this.maxSteerAngle=Math.PI/2;
    }

    // normalize the angle in order to get only positive values
    normalizeAngle() {
        let angle = this.dir.heading();
        while (angle < 0) {
            angle += 2 * PI;
        }
        this.dir = p5.Vector.fromAngle(angle);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading());
            stroke(255, 80);
            fill(0, 255, 0, 80);    
            let triangleSize = 15;
            triangle(0, triangleSize / 4, 0, -triangleSize / 4, triangleSize, 0);
        pop();
    }

    predict(delta_t, std_pos, vel, yaw_rate) {
        if (yaw_rate > this.maxSteerAngle) {
            yaw_rate = this.maxSteerAngle;
        } else if (yaw_rate < -this.maxSteerAngle) {
            yaw_rate = -this.maxSteerAngle;
        }

        let theta = this.dir.heading();
        if (yaw_rate > 0.0001 || yaw_rate < -0.0001) {
            this.pos.x = this.pos.x + (vel / yaw_rate) * (sin(theta + yaw_rate * delta_t) - sin(theta));
            this.pos.y = this.pos.y + (vel / yaw_rate) * (cos(theta) - cos(theta + yaw_rate * delta_t));
            this.dir = p5.Vector.fromAngle(theta + yaw_rate * delta_t);
        } else {
            this.pos.x = this.pos.x + vel * delta_t * cos(theta);
            this.pos.y = this.pos.y + vel * delta_t * sin(theta);
        }

        this.pos.x = randomGaussian(this.pos.x, std_pos[0]);
        this.pos.y = randomGaussian(this.pos.y, std_pos[1]);
        let new_angle = degrees(this.dir.heading());
        this.dir = p5.Vector.fromAngle(radians(randomGaussian(new_angle, std_pos[3])));

        this.normalizeAngle();
    }

    updateWeights(robotMeasurements, std_landmark) {
        let final_weight = 1.0;        
        for (let measurement of this.measurements) {
            let rMeasurement = measurement.rMeasurement;
            let pMeasurement = measurement.pMeasurement;
        }
        return final_weight;
    }
    checkCollision(walls, robotMeasurements) {
        
    }

}