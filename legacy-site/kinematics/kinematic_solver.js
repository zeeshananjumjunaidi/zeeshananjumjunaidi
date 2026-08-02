
class KinematicSolver{

    constructor(joints){
        this.joints = joints;
    }

    forwardKinematics(angles=[]){
        let prevPoint = this.joints[0].position;
        let rotation = new THREE.Quaternion();
        for(let i=0;i<this.joints.length;i++){
            rotation *= this.joints[i].quaternion.setFromAxisAngle( 
                angles[i - 1], this.joints[i - 1].axis
            );
            let nextPoint = prevPoint + rotation * this.joints[i].StartOffset;
    
            prevPoint = nextPoint;
        }
        return prevPoint;
    }
    forwardKinematics(angles=[]){
        let bJ = new THREE.Matrix4();
        let a=  0;// angle
        let l = 1;//length
        bJ.set(Math.cos(a),-Math.sin(a),0,0,Math.sin(a),Math.cos(a),0,0,0,0,1,l,0,0,0,1);
    }
    getPoseMatrix(d,theta,R,A){        
        // d is the depth along the preivous joint's z axis, from the origin to the normal
        // theta is the angle about the previous z to align its x with the new origin
        // r is the distance along the rotated x axis.
        // and A (alpha) rotates about the new x-axis to put z in its desired orientation.
        
        let bJ = new THREE.Matrix4();
        bJ.set(Math.cos(a),-Math.sin(a),0,0,
        Math.sin(a),Math.cos(a),0,0,
        0,  0,    1,    l,
        0,  0,    0,   1);

    }
}