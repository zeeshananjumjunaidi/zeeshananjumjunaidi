
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
}