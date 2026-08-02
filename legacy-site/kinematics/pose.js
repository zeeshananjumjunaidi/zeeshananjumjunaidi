

class Pose {
    constructor(position, rotation, jointObj, pose) {
        this.pose = pose;
        this.startOffset = jointObj.position;
        this.position = position;
        this.rotation = rotation;
    }
    rotateAroundZ(a) {
        return math.matrix([[Math.cos(a), -Math.sin(a), 0],
        [Math.sin(a), Math.cos(a), 0],
        [0, 0, 1]]);
    }
    rotateAroundY(a) {
        return  math.matrix([[Math.cos(a), 0, Math.sin(a)],
        [0, 1, 0],
        [-Math.sin(a), 0, Math.cos(a)]]);
    }
    rotateAroundX(a) {
        return  math.matrix([
            [1, 0, 0],
            [0, Math.cos(a), -Math.sin(a)],
            [0, Math.sin(a), Math.cos(a)]]);
    }
    getFullRotationMatrix(a){
        return math.multiply(math.multiply(
            this.rotateAroundX(a),
            this.rotateAroundY(a)),
            this.rotateAroundZ(a));
    }
}