class RoboticArm{

    constructor(sceneRef){
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
        this.sceneRef=sceneRef;
        this.loadRoboticArm(this.sceneRef);
    }
    loadRoboticArm(sceneRef) {
        const loader = new THREE.FBXLoader();
        loader.load("../assets/3d/robotic_arm/robotic_arm.fbx", model => {
            console.log(model);
            model.traverse((child)=> {
                if (child instanceof THREE.Group) {       
                    //  console.log(child.name);       
                    if(child.name=='Base'){
                        this.armBase =child;
                    }else if(child.name=='endEffector'){
                        this.endEffector=child;
                    }else if(child.name=='Arm2'){
                        this.arm2=child;
                    }else if(child.name=='Arm3'){
                        this.arm3=child;
                    }
                }
            });
            sceneRef.add(model);
        });    
    }
    update(){
        window.BLAS
    }
    moveToTarget(targetPos){

    }
    distanceToTarget(){
        return this.endEffector.position.distanceTo(this.targetPos);
    }
    randomAnimate(dt){
        if(this.endEffector&&this.arm2&&this.arm3&&this.armBase){
        this.armBase.rotation.y = Math.sin(dt*0.0005);
        this.endEffector.rotation.x = Math.cos(dt*0.0005);
        this.arm2.rotation.x = Math.cos(dt*0.0005);
        this.arm3.rotation.x = Math.cos(dt*0.0005);}    
    }
}