

class Pose{
    constructor(position,rotation,jointObj,pose){
        this.pose=pose;
        this.startOffset = jointObj.position;
        this.position=position;
        this.rotation = rotation;
    }
}