class RoboticArm {

    constructor(sceneRef) {
        this.armBase; // from endEffector to Base = 61.043
        this.endEffector; // Length = 4.958
        this.arm2; // Length = 24.357
        this.arm3; // Length = 28.534

        this.groundLevel = 1.941; // armBaseFromGround = 1.941
        this.arm3Len = 28.534;
        this.arm2Len = 24.357;
        this.endEffectorLen = 4.958;
        this.armFullLength = 61.043;
        this.targetPos = new THREE.Vector3();
        this.sceneRef = sceneRef;
        this.loadRoboticArm(this.sceneRef);
        this.baseJoint;
        this.joint1;
        this.joint2;
        this.Joint3;
    }
    loadRoboticArm(sceneRef) {
        const loader = new THREE.FBXLoader();

            loader.load("../assets/3d/robotic_arm/robotic_arm.fbx", model => {
                console.log(model);
                model.traverse((child) => {
                    if (child instanceof THREE.Group) {
                        //  console.log(child.name);       
                        if (child.name == 'Base') {
                            this.armBase = child;         
                            this.baseJoint = new Joint(JointType.Revolute,this.armBase,this.groundLevel,0);                  
                        } else if (child.name == 'endEffector') {
                            this.endEffector = child;         
                            this.joint1 = new Joint(JointType.Revolute,this.endEffector,this.endEffectorLen,0);                
                        } else if (child.name == 'Arm2') {
                            this.arm2 = child;  
                            this.joint2 = new Joint(JointType.Revolute,this.arm2,this.arm2Len,0);
                        } else if (child.name == 'Arm3') {
                            this.arm3 = child;  
                            this.joint3 = new Joint(JointType.Revolute,this.arm3,this.arm3Len,0);
                        }
                    }else if (child instanceof THREE.Mesh){
                        if(child.name =='plane'){
                        console.log(child.name);
                            child.visible=false;
                    }
                    }
                });
                sceneRef.add(model);
        });
    }
    getEndEffectorPosition(){
        if(this.baseJoint&&this.joint1&&this.joint2&&this.joint3){
       
        }
    }

    update() {
        
    }
    moveToTarget(targetPos) {

    }
    distanceToTarget() {
        return this.endEffector.position.distanceTo(this.targetPos);
    }
    randomAnimate(dt) {
        if (this.endEffector && this.arm2 && this.arm3 && this.armBase) {
            this.armBase.rotation.y = Math.sin(dt * 0.0005);
            this.endEffector.rotation.x = Math.cos(dt * 0.0005);
            this.arm2.rotation.x = Math.cos(dt * 0.0005);
            this.arm3.rotation.x = Math.cos(dt * 0.0005);
        }
    }
}