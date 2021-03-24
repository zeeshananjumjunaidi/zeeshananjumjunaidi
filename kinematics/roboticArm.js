class RoboticArm {

    constructor(sceneRef) {
        this.armBase; // from endEffector to Base = 61.043
        this.endEffector; // Length = 4.958
        this.arm2; // Length = 24.357
        this.arm3; // Length = 28.534
        this.arm4; // Length = 28.534

        this.groundLevel = 1.941 + 3.5; // armBaseFromGround = 1.941
        this.endEffectorLen = 4.958;
        this.arm2Len = 24.357;
        this.arm3Len = 28.534;
        this.arm4Len = 24.357;
        this.textObjects=[];
        // setInterval(() => {
        //     let a1 = (Math.sin(this.armBase.rotation.y) * this.groundLevel); // BaseArm  
        //     let a2 = (Math.cos(this.arm2.rotation.x) * this.arm2Len);// Arm 2 rotation
        //     let a3 = (Math.cos(this.arm3.rotation.x) * this.arm3Len);// Arm 3 rotation
        //     let a4 = (Math.cos(this.endEffector.rotation.x) * this.endEffectorLen);//End Effector
        //     let a = a1+a2+a3+a4;
        //     console.log(a);
        // }, 1000);
        // setInterval(() => { console.clear(); }, 10000);

        // Testing ground level height
        const geometry = new THREE.SphereGeometry(2.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // base_height = 1.941, Base joint = 3.5
        this.target = new THREE.Mesh(geometry, material);
        this.target.position.y = 1.941 + 3.5 + 24.357 + 28.534 + 4.958;
        // sphere.position.x = -2.941;
        sceneRef.add(this.target);


        this.targetPos = new THREE.Vector3();
        this.sceneRef = sceneRef;
        this.loadRoboticArm(this.sceneRef);
        this.baseJoint;
        this.joint1;
        this.joint2;
        this.Joint3;
        this.Joint4;
    }
    loadRoboticArm(sceneRef) {
        const loader = new THREE.FBXLoader();
        loader.load('../assets/3d/robotic_arm/axis.fbx', axisModel => {
            loader.load("../assets/3d/robotic_arm/robotic_arm_4_joints.fbx", model => {
                model.traverse((child) => {
                    if (child instanceof THREE.Group) {
                        if (child.name == 'Base') {
                            this.armBase = child;
                            this.armBase.add(this.addText('RobX'));

                            this.armBase.add(axisModel.clone());
                            this.baseJoint = new Joint(JointType.Revolute, this.armBase, this.groundLevel, 0);
                        } else if (child.name == 'endEffector') {
                            this.endEffector = child;
                            let _axis = axisModel.clone();
                            this.endEffector.add(_axis);
                            this.joint1 = new Joint(JointType.Revolute, this.endEffector, this.endEffectorLen, 0);
                        } else if (child.name == 'Arm2') {
                            this.arm2 = child;
                            let _axis = axisModel.clone();
                            this.arm2.add(_axis);
                            this.joint2 = new Joint(JointType.Revolute, this.arm2, this.arm2Len, 0);
                        } else if (child.name == 'Arm3') {
                            this.arm3 = child;
                            let _axis = axisModel.clone();
                            this.arm3.add(_axis);
                            this.joint3 = new Joint(JointType.Revolute, this.arm3, this.arm3Len, 0);
                        } else if (child.name == 'Arm4') {
                            this.arm4 = child;
                            let _axis = axisModel.clone();
                            this.arm4.add(_axis);
                            this.joint4 = new Joint(JointType.Revolute, this.arm4, this.arm4Len, 0);
                        }
                    } else if (child instanceof THREE.Mesh) {
                        if (child.name == 'plane') {
                            child.visible = false;
                        } else {
                            child.castShadow = true;
                        }
                    }
                });
                sceneRef.add(model);
                this.setInitialPose();
                this.recalculateLinkLength();
            });
        });
    }
    setInitialPose() {
        this.endEffector.rotation.x = Math.PI / 3;
        this.arm2.rotation.x = Math.PI / 3;
        this.arm3.rotation.x = Math.PI / 3;
    }
    // This is only applicable in simulator
    recalculateLinkLength() {

        console.log(this.arm3.rotation.y);

    }

    getEndEffectorPosition() {
        if (this.baseJoint && this.joint1 && this.joint2 && this.joint3) {
            return 1;
        }
    }

    update() {
        if(this.target&&this.arm3){
            // this.target.position.x = this.arm2.position.x;
            // this.target.position.z = this.arm2.position.z;
            let _y = Math.cos(this.arm3.rotation.x)* this.arm3Len;
            let _z =Math.sin(this.arm3.rotation.x)* this.arm3Len;
            // let _x = Math.sin(this.armBase.rotation.y+this.arm3.rotation.y)*this.arm3Len;
            //  _y +=   +  Math.cos(this.arm2.rotation.x)* this.arm3Len;
            //  _z +=  +Math.sin(this.arm2.rotation.x)* this.arm3Len;
           
           // https://medium.com/@ringlayer/forward-kinematics-calculation-for-robotic-arm-6393934f847
            // let d3 = Math.sin(this.arm3.rotation.x)* this.arm3Len;
            // let d2 = Math.sin(this.arm2.rotation.x)* this.arm2Len;
            // let t4 = 2*Math.PI - (this.arm3.rotation.x-Math.PI);
            // // t3 = t4 + t5
            // let t3 = this.arm2.rotation.x;
            // let t5 = t3-t4
            // let d6 = Math.cos(t5)*this.arm2Len;
            // _z = d2 + d3  - d6;

            this.target.position.y=_y;
            this.target.position.z=_z;
            // this.target.position.x=_x;
        }
        // for(let i=0;i<this.textObjects.length;i++){
        //     let tO = this.textObjects[i];
        //     tO[0].position.x=tO[1].position.x;
        //     tO[0].position.y=tO[1].position.y;
        //     tO[0].position.z=tO[1].position.z;
        //     // console.log(tO[0].children[0])
        // }
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
            this.arm4.rotation.x = Math.cos(dt * 0.0005);
        }
    }

    addText(textData,position) {
        const container = new ThreeMeshUI.Block({
            width: 10.2,
            height: 3,
            padding: 0.05,
            justifyContent: 'center',
            alignContent: 'center',
            fontFamily: '../assets/fonts/Roboto-msdf.json',
            fontTexture: '../assets/img/Roboto-msdf.png'
        });
        console.log(container);
        container.position.y =1;// position.y;
        container.position.x =-6;// position.x;
        container.position.z =0;// position.z;
        // container.rotation.y = -Math.PI/2;
        container.rotation.z = -Math.PI/2;
        container.rotation.x = -Math.PI/2;
        const text = new ThreeMeshUI.Text({
            fontSize: 2.08,
            content: textData//'x:23.54'
        });

        container.add(text);

        // scene is a THREE.Scene (see three.js)
        // this.sceneRef.add(container);
        return container;
    }
}