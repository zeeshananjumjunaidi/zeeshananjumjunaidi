

const JointType = Object.freeze({
    Revolute:   Symbol("revolute"),
    Prismatic:  Symbol("prismatic")
});

class Joint{
    // Type Revolute, Prismatic
    constructor (type,jointObj){
        if(type == JointType.Prismatic||type == JointType.Revolute){
            this.type = type;
            this.jointObj = jointObj;
        }else{
            throw new Error("Unknown Joint Type");
        }
    }

}