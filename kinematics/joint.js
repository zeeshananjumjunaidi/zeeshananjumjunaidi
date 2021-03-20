

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
    rotateAroundXAxis(y){
        /*
            1 0 0
            0 cosγ −sin γ
            0 sinγ cos γ
        */
        let x = (1 * (Math.cos(y)*Math.cos(y)));
        return x;
    }
    rotateAroundYAxis(b){
        /*
        cos β 0 sinβ
        0     1     0
        −sin β 0 cosβ
        */
        let y = (Math.cos(b) * (Math.cos(b))) - (-Math.sin(b)*Math.sin(b));
        return y;
    }
    rotateAroundZAxis(a){
        /*
        cos α −sin α 0
        sin α cos α 0
        0     0     1
        */
        let z = (Math.cos(a) * (Math.cos(a))) - (Math.sin(a)*-Math.sin(a));
        return z;
    }
}