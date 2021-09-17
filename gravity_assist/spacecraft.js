
class Spacecraft {
    constructor(x, y, mass, sizeInRadius) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.sizeInRadius = sizeInRadius;
    }
    draw() {
        fill(0, 0, 255);
        circle(this.x, this.y, this.sizeInRadius);
    }
}