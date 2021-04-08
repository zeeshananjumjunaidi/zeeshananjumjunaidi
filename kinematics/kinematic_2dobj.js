
class Kinematic2DObject {
    constructor(x, y, index, segmentSize = 20, segmentCount = 3,  isPredator = false) {
        this.x =x;
        this.y =y;
        this.index = index;
        this.target = new p5.Vector3();
    }
 
    follow(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
    update() {

    }
}