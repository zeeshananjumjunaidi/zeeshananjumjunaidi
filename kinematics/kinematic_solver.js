
class KinematicSolver{

    constructor(roboticArm,sceneRef){
        this.roboticArm = roboticArm;
        this.sceneRef=sceneRef;
        this.xAxis;
        this.yAxis;
        this.zAxis;
        this.loadAxisModel(sceneRef);
    }
    loadAxisModel(sceneRef){
        const loader = new THREE.FBXLoader();
        loader.load("../assets/3d/robotic_arm/Axis.fbx", model => {
            model.scale.set(3,3,3);
            model.traverse((child)=> {
                if (child instanceof THREE.Group) {       
                    //  console.log(child.name);       
                    if(child.name=='xAxis'){
                        this.xAxis =child;
                    }else if(child.name=='yAxis'){
                        this.yAxis=child;
                    }else if(child.name=='zAxis'){
                        this.zAxis=child;
                    }
                }
            });
            sceneRef.add(model);
        });    
    
    }

    getDesiredAngles(x,y,z){
        //TODO: return desired angles.
    }

}