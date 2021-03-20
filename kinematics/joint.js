

const JointType = Object.freeze({
    Revolute:   Symbol("revolute"),
    Prismatic:  Symbol("prismatic")
});

class Joint{
    // Type Revolute, Prismatic
    constructor (type,jointObj, jointLength,jointInitAngle){
        if(type == JointType.Prismatic||type == JointType.Revolute){
            this.type = type;
            this.obj = jointObj;
            this.jointLength = jointLength;
            this.heading = jointInitAngle
        }else{
            throw new Error("Unknown Joint Type");
        }
    }

}