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
        this.textObjects = [];
        // Testing ground level height
        const geometry = new THREE.SphereGeometry(2.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        // base_height = 1.941, Base joint = 3.5
        this.target = new THREE.Mesh(geometry, material);
        this.target.position.y = 1.941 + 3.5 + 24.357 + 28.534 + 4.958;
        // sphere.position.x = -2.941;
        sceneRef.add(this.target);


        this.targetPos = new THREE.Vector3();
        this.targetPos.y = 63.2899999; // 1.941 + 3.5 + 24.357 + 28.534 + 4.958;
        // this.target.position.x = this.targetPos.x;
        // this.target.position.y = this.targetPos.y;
        // this.target.position.z = this.targetPos.Z;
        this.sceneRef = sceneRef;
        this.loadRoboticArm(this.sceneRef);
        this.baseJoint;
        this.joint1;
        this.joint2;
        this.Joint3;
        this.Joint4;
        this.linePoints = [new THREE.Vector3(- 10, 0, 0), new THREE.Vector3(10, 0, 0)];
        this.line;
        this.addDistanceLine();
    }
    addDistanceLine() {
        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        const points = [];
        points.push(this.linePoints[0]);
        points.push(this.linePoints[1]);

        let lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        lineGeom.verticesNeedUpdate = true;
        this.line = new THREE.Line(lineGeom, material);
        this.line.matrixAutoUpdate = true;
        this.sceneRef.add(this.line);
        this.kinematicSolver;
    }
    loadRoboticArm(sceneRef) {
        let colors = ['0xff0000', '0x00ff00', '0x770000'];
        const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.RGBFormat);
        gradientMap.minFilter = THREE.NearestFilter;
        gradientMap.magFilter = THREE.NearestFilter;
        gradientMap.generateMipmaps = false;
        let toonMainMtl = new THREE.MeshToonMaterial({
            color: 0xff5500,
            gradientMap: gradientMap
        });
        let toonBlkMtl = new THREE.MeshToonMaterial({
            color: 0x333333,
            gradientMap: gradientMap
        });

        const loader = new THREE.FBXLoader();
        loader.load('../assets/3d/robotic_arm/axis.fbx', axisModel => {
            loader.load("../assets/3d/robotic_arm/robotic_arm_4_joints.fbx", model => {
                let poses = [];
                // model.rotation.x=Math.PI/2;
                model.traverse((child) => {
                    if (child instanceof THREE.Group) {
                        if (child.name == 'Base') {
                            this.armBase = child;
                            this.armBase.add(this.addText('Y is up'));
                            let armAxis = axisModel.clone();
                            armAxis.scale.set(3, 3, 3);
                            this.armBase.add(armAxis);
                            this.baseJoint = new Joint(JointType.Revolute, this.armBase, this.groundLevel, 0);
                        } else if (child.name == 'endEffector') {
                            this.endEffector = child;
                            this.endEffector.children[1].material = toonBlkMtl;// Material was missing in original model.
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
                            // console.log(child.material.name);
                            if (child.material.name == 'OrangeMetal')
                                child.material = toonMainMtl;
                            else if (child.material.name == 'BlackMtl')
                                child.material = toonBlkMtl;
                            child.castShadow = true;
                        }
                    }
                });
                poses.push(new Pose(this.armBase.position, this.armBase.rotation, this.armBase,
                    new THREE.Vector3(0, 1, 0)));
                poses.push(new Pose(this.arm2.position, this.arm2.rotation, this.arm2,
                    new THREE.Vector3(0, 1, 0)));
                poses.push(new Pose(this.arm3.position, this.arm3.rotation, this.arm3,
                    new THREE.Vector3(0, 1, 0)));
                poses.push(new Pose(this.arm4.position, this.arm4.rotation, this.arm4,
                    new THREE.Vector3(0, 1, 0)));
                poses.push(new Pose(this.endEffector.position, this.endEffector.rotation, this.endEffector,
                    new THREE.Vector3(0, 1, 0)));

                this.kinematicSolver = new KinematicSolver(poses);
                window.ttt = this.arm2;
                document.addEventListener('keydown', (event) => {
                    if (event.key == ' ') {
                        console.log("test solving FK");
                        let angels = [this.getEulerAngle(this.armBase.rotation),
                        this.getEulerAngle(this.arm2.rotation),
                        this.getEulerAngle(this.arm3.rotation),
                        this.getEulerAngle(this.arm4.rotation),
                        this.getEulerAngle(this.endEffector.rotation)];
                        this.kinematicSolver.forwardKinematics(angels);
                    }
                });
                sceneRef.add(model);
                // this.setInitialPose();
                this.recalculateLinkLength();
            });
        });
    }
    getEulerAngle(rotation, eulerAxis = 'xyz') {
        return new THREE.Euler().setFromQuaternion(rotation, eulerAxis);
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
        // if(this.target&&this.arm3){
        //     let _y = Math.cos(this.arm3.rotation.x)* this.arm3Len;
        //     let _z =Math.sin(this.arm3.rotation.x)* this.arm3Len;
        //     // this.target.position.y=_y;
        //     // this.target.position.z=_z;
        // }
        if (this.endEffector) {
            this.linePoints[0] = this.endEffector.position;
            this.line.updateMatrix();
        }
        let armLength = this.groundLevel +
            this.endEffectorLen +
            this.arm2Len +
            this.arm3Len +
            this.arm4Len;
    //    if (armLength > Math.sqrt(Math.pow(this.target.position.x, 2) + Math.pow(this.target.position.y, 2) + Math.pow(this.target.position.z, 2))) {
            if(this.armBase&&this.arm2&&this.arm3&&this.arm4&&this.endEffector){
            // equations are wrong, require solution of these equation using trig identities.
                let x = //this.groundLevel*Math.cos(this.armBase.rotation.y)+
            this.arm2Len * Math.cos(this.arm2.rotation.x)+
            this.arm3Len * Math.cos(this.arm2.rotation.x+this.arm3.rotation.x)+
            this.arm4Len *Math.cos(this.arm2.rotation.x+this.arm3.rotation.x+this.arm4.rotation.x)+
            this.endEffectorLen *Math.cos(this.arm2.rotation.x+this.arm3.rotation.x+this.arm4.rotation.x+this.endEffector.rotation.x);
            let y =// this.groundLevel*Math.sin(this.armBase.rotation.y)+
            this.arm2Len * Math.sin(this.arm2.rotation.x)+
            this.arm3Len * Math.sin(this.arm2.rotation.x+this.arm3.rotation.x)+
            this.arm4Len * Math.sin(this.arm2.rotation.x+this.arm3.rotation.x+this.arm4.rotation.x)+
            this.endEffectorLen *Math.sin(this.arm2.rotation.x+this.arm3.rotation.x+this.arm4.rotation.x+this.endEffector.rotation.x);
            this.target.position.x=x;
            this.target.position.y=y;
        }        
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

    addText(textData, position) {
        const container = new ThreeMeshUI.Block({
            width: 10.2,
            height: 3,
            padding: 0.05,
            justifyContent: 'center',
            alignContent: 'center',
            fontFamily: '../assets/fonts/Roboto-msdf.json',
            fontTexture: '../assets/img/Roboto-msdf.png'
        });
        container.position.y = 1;// position.y;
        container.position.x = -6;// position.x;
        container.position.z = 0;// position.z;
        // container.rotation.y = -Math.PI/2;
        container.rotation.z = -Math.PI / 2;
        container.rotation.x = -Math.PI / 2;
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