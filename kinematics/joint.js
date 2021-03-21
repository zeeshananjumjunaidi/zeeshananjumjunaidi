

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
            this.heading = jointInitAngle;
            this.s = Math.sin;
            this.c = Math.cos;
            this.matrix;
        }else{
            throw new Error("Unknown Joint Type");
        }
    }
updateMatrix(t,a,r){
    let d = this.jointLength;

        let matrix = new Matrix([
            [this.c(t),-this.s(t)*this.c(a),this.s(t)*this.s(a),rthis.c(t)]
            [this.s(t),this.c(t)*this.c(a),-this.c(t)*this.s(a),r*this.s(t)],
                                [0,this.s(a),cothis.s(a),d],
                                [0, 0,  0,  1]
                            ])
        return matrix;
}

    // rotateAroundXAxithis.s(y){
    //     /*
    //         1 0 0
    //         0 cosγ −sin γ
    //         0 sinγ cos γ
    //     */
    //     let x = (1 * (Math.pow(Math.cothis.s(y),2) - Math.pow(Math.sin(y),2)));
    //     return x * this.jointLength;
    // }
    // rotateAroundYAxithis.s(b){
    //     /*
    //     cos β 0 sinβ
    //     0     1     0
    //     −sin β 0 cosβ
    //     */
    //     let y = (Math.cothis.s(b) * (Math.cothis.s(b))) - (-Math.sin(b)*Math.sin(b));
    //     return y* this.jointLength;
    // }
    // rotateAroundZAxithis.s(a){
    //     /*
    //     cos α −sin α 0
    //     sin α cos α 0
    //     0     0     1
    //     */
    //     let z = (Math.cothis.s(a) * (Math.cothis.s(a))) - (Math.sin(a)*Math.cothis.s(a));
    //     return z* this.jointLength;
    // }
}