(function () {
    var vel = new CANNON.Vec3(0, 1, 0);
    var currentHeight = new CANNON.Vec3();


    // var pid = new PID(0.01, 0.00001, 0.0001, t);

    var PID_pitch = new PIDController();
    var PID_pitch_gains = new CANNON.Vec3(0.001,0.0001,0.001); //(2, 3, 2)
    // var PID_pitch_gains = new CANNON.Vec3(0.01, 0.00001, 0.0001); //(2, 3, 2)
    var throttle = 0;
    document.addEventListener('keydown', function (ev) {
        const up = ['ArrowUp', 'w'];
        const down = ['ArrowDown', 's'];
        const left = ['ArrowLeft', 'a'];
        const right = ['ArrowRight', 'd'];
        if (up.includes(ev.key)) {
            currentHeight.y += delta*100;
            // vel.y += 0.1;
        } else if (down.includes(ev.key)) {
            currentHeight.y -= delta*100;
            // vel.y -= 0.1;
        } else if (left.includes(ev.key)) {

        } else if (right.includes(ev.key)) {
        }
        // console.log(vel,robotBody.velocity);
    });


    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0);

    var robot;
    const robotBody = new CANNON.Body({ mass: 1 });
    var rotors = [];
    function loadQuadCopter(sceneRef) {
        const loader = new THREE.FBXLoader();
        const textureLoader = new THREE.TextureLoader();
        let lens = textureLoader.load('./models/lens.jpg');
        let metal = textureLoader.load('./models/metal.jpg');
        let primary = textureLoader.load('./models/primary.jpg');
        let secondary = textureLoader.load('./models/secondary.jpg');
        let rubber = textureLoader.load('./models/rubber.jpg');
        loader.load("./models/rotor-model.fbx", model => {
            console.log(model);
            robot = model;
            robot.position.y = 1.5;
            model.scale.set(1, 1, 1);
            // robot.add(camera);
            camera.lookAt(robot.position)
            // Add rigidbody
            const robotShape = new CANNON.Box(new CANNON.Vec3(1.5, 1.5, 1.5));
            robotBody.addShape(robotShape);
            robotBody.position.x = model.position.x;
            robotBody.position.y = model.position.y;
            robotBody.position.z = model.position.z;
            world.addBody(robotBody);

            const pointLight = new THREE.PointLight(0xff0000, 4, 100);
            pointLight.position.set(5, 0, 0.5);
            robot.add(pointLight);
            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
            sceneRef.add(pointLightHelper);

            model.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true; //default is false
                    // child.receiveShadow = true; //default
                    let m = child.material;
                    if (m.name == 'MetalMtl') { m.map = metal; }
                    else if (m.name == 'primaryMtl') { m.map = primary; }
                    else if (m.name == 'secondaryMtl') { m.map = secondary; }
                    else if (m.name == 'LensMtl') { m.map = lens; }
                    else if (m.name == 'RubberMtl') { m.map = rubber }

                }

                else if (child instanceof THREE.Group) {
                    child.children.forEach(part => {
                        if (["WFR", "WFL", "WBR", "WBL"].includes(part.name)) {

                            part.children.forEach(rotor => {
                                if (rotor.name.indexOf("_rotor") > -1) {
                                    console.log(rotor.name);
                                    rotors.push(rotor);
                                }
                            });
                        }
                    });
                }

            });
            sceneRef.add(model);
        });
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-15, 15, 7);
    // camera.position.set(15, 0, 10);
    // camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#e66e27", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    // controls.maxDistance = 20;
    //controls.minPolarAngle = 0; // radians
    // controls.maxPolarAngle = Math.PI; // radians
    //controls.maxPolarAngle = Math.PI / 2;

    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 10, 1);
    light.position.set(5, 4, 0);
    light.castShadow = true; // default false    
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1512; // default
    light.shadow.mapSize.height = 1512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 5000; // default
    scene.add(light);
    const lighthelper = new THREE.DirectionalLightHelper(light, 15);
    scene.add(lighthelper);

    const circle = createCircle();
    circle.rotation.x=Math.PI/2;
    scene.add(circle);

    const planeGeom = new THREE.PlaneGeometry(50, 50);
    planeGeom.receiveShadow = true;
    // #e66e27
    const groundMtl = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeom, groundMtl);
    planeObject.rotation.set(Math.PI / 2, 0, 0);
    scene.add(planeObject);

    const planeShape = new CANNON.Plane()
    const planeBody = new CANNON.Body({ mass: 0 })
    planeBody.addShape(planeShape)
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.addBody(planeBody)


    // --------------------- Load Quadcopter --------------//
    loadQuadCopter(scene);
    // --------------------- Target Height ---------------//
    const dir = new THREE.Vector3(1, 2, 0);

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1;
    const hex = 0xffff00;

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    scene.add(arrowHelper);


    // --------------------- Animate ----------------------//

    const clock = new THREE.Clock()
    let delta;
    const animate = function (time) {
        // let deltaTime = time * 0.0001;
        delta = Math.min(clock.getDelta(), 0.1)
        world.step(delta)

        requestAnimationFrame(animate);
        // console.log(time);
        if (rotors.length > 0) {
            for (let i = 0; i < rotors.length; i++) {
                rotors[i].rotation.z += delta * 50 * vel.length();
            }
        }
        if (robot && robotBody) {
            
            robot.position.set(robotBody.position.x, robotBody.position.y, robotBody.position.z);
            
            robotBody.velocity.x = vel.x;
            PID_pitch.setTime(delta);
            let PID_pitch_gains_adapted = throttle > 100 ? PID_pitch_gains * 2 : PID_pitch_gains;
            let pitchError = getPitchError(robotBody.position, currentHeight);
            //Get the output from the PID controllers
            let PID_pitch_output = PID_pitch.GetFactorFromPIDController(PID_pitch_gains_adapted, pitchError);
          //  console.log(pitchError,PID_pitch_output);

            robotBody.velocity.y += PID_pitch_output*9.8*10;
            

            circle.position.set(currentHeight.x,currentHeight.y,currentHeight.z);

            camera.lookAt(robot.position);          
        }
        controls.update();
        renderer.render(scene, camera);

    };
    function getPitchError(current, target) {
        //        let yAngle = current.y;
        return target.y - current.y;
    }

    animate();

})();