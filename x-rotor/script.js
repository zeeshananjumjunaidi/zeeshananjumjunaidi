
class Quadcopter {
    constructor(position, quaternion) {
        this.position = position;
        this.quaternion = quaternion;
        this.isEngineStart = false;
    }
    start() {
        this.isEngineStart = true;
    }
    stop() {
        this.isEngineStart = false;
    }
    toggleEngine() {
        this.isEngineStart = !this.isEngineStart;
    }
}

(function () {


    const up = ['ArrowUp', 'w'];
    const down = ['ArrowDown', 's'];
    const left = ['ArrowLeft', 'a'];
    const right = ['ArrowRight', 'd'];

    //  --------------- System State -------------
    var isPlaying = true;

    //  --------------- Quadcopter ---------------
    var quadcopter = new Quadcopter();
    quadcopter.start();
    var vel = new CANNON.Vec3(0, 1, 0);
    var targetPosition = new CANNON.Vec3(0, 5, 0);
    // var pid = new PID(0.01, 0.00001, 0.0001, t);

    var PID_pitch = new PIDController();
    var PID_pitch_gains = new CANNON.Vec3(0.001, 0.0001, 0.001); //(2, 3, 2)


    var PID_forward = new PIDController();
    var PID_forward_gains = new CANNON.Vec3(0.0051, 0.00001, 0.0001); //(2, 3, 2)

    var PID_sideway = new PIDController();
    var PID_sideway_gains = new CANNON.Vec3(0.0001, 0.00001, 0.0001); //(2, 3, 2)

    // var PID_pitch_gains = new CANNON.Vec3(0.01, 0.00001, 0.0001); //(2, 3, 2)
    var throttle = 0;
    var forward = 0;
    var sideway = 0;
    let engineBtn = document.querySelector('#engineBtn');
    let helpBtn = document.querySelector('#helpBtn');
    let playpauseBtn = document.querySelector('#playpauseBtn');
    let resetBtn = document.querySelector('#resetBtn');
    let pauseScreen = document.querySelector('#pauseScreen');
    let stats = document.querySelector('#stats');
    let batteyStats = document.querySelector('#battery-value');

    // var batteryImage = document.querySelector('#battery-image');
    // batteryImage.className = 'fas fa-battery-empty fa-rotate-270';
    var cameraInitPosition = new THREE.Vector3();
    let batteryInterval = -1;
    let batteryValue = 100;
    batteryInterval = setInterval(function () {
        batteyStats.innerHTML = `${batteryValue}%`;
        if (isPlaying && quadcopter.isEngineStart) {
            batteryValue -= 1;
        }
        if (batteryValue >= 97) {
            //     batteryImage.className = 'fas fa-battery-full fa-rotate-270';
        } else if (batteryValue >= 50) {
            // batteryImage.classList.remove('fa-battery-full');
            // batteryImage.classList.add('fa-battery-three-quarters');
            //    batteryImage.className = 'fas fa-battery-three-quarters fa-rotate-270';
        } else if (batteryValue >= 10) {
            //     batteryImage.className = 'fas fa-battery-quarter fa-rotate-270';
        } else if (batteryValue > 0) {
            //   batteryImage.className = 'fas fa-battery-empty fa-rotate-270';
        } else {
            console.log('Engine Stopped');
            clearInterval(batteryInterval);
            quadcopter.isEngineStart = false;
        }
        //console.log(batteryValue, batteryImage,batteryImage.className);
    }, 5000);
    resetBtn.addEventListener('click', () => {
        location.reload();
    });
    playpauseBtn.addEventListener('click', () => {
        togglePause();
    });
    helpBtn.addEventListener('click', function () {
        togglePause();
    });
    function togglePause() {
        isPlaying = !isPlaying;
        console.log('pause', isPlaying);
        if (isPlaying) {
            animate();
            pauseScreen.classList.remove('disabled');
            playpauseBtn.innerHTML = `Pause <i class="fas fa-pause"></i>`;
        } else {
            pauseScreen.classList.add('disabled');
            playpauseBtn.innerHTML = `Play <i class="fas fa-play"></i>`;
        }
    }
    engineBtn.addEventListener('click', () => {
        toggleEngine();
    });
    document.addEventListener('contextmenu', function () {
        console.log('right click');
    });


    var keyMap = {};

    document.addEventListener('keyup', function (ev) {
        keyMap[ev.key] = false;
    });
    document.addEventListener('keydown', function (ev) {

        const keyTimeConstant = (1.0 - Math.pow(0.101, delta));
        if (left.includes(ev.key)) {
            keyMap[ev.key] = true;

        } else if (right.includes(ev.key)) {
            keyMap[ev.key] = true;
        }
        if (up.includes(ev.key)) {
            keyMap[ev.key] = true;
        } else if (down.includes(ev.key)) {
            keyMap[ev.key] = true;
        }
        if (ev.key == 'e') {
            // keyMap[ev.key] = true;
            toggleEngine();
        }
        if (ev.key == 'p' || ev.key == 'h') {
            // keyMap[ev.key] = true;
            togglePause();
        }
        if (ev.key == ' ') {
            keyMap[ev.key] = true;
        } else if (ev.key == 'Control') {
            keyMap[ev.key] = true;
        }

    });

    function toggleEngine() {
        quadcopter.toggleEngine();
        if (quadcopter.isEngineStart) {
            engineBtn.innerHTML = 'Turn Off <i class="fas fa-power-off"></i>';
        } else {
            engineBtn.innerHTML = 'Turn On <i class="fas fa-power-off"></i>';
        }
    }
    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0);

    var robot;
    const robotBody = new CANNON.Body({ mass: 10 });
    robotBody.angularDamping = 1;
    console.log(robotBody)
    window.robotBody = robotBody;
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
            robot = model;
            thirdPersonCamera = new ThridPersonCamera({ camera: camera, target: robot });
            robot.position.y = 5;
            model.scale.set(1, 1, 1);
            // robot.add(camera);
            //robot.add(light);
            camera.lookAt(robot.position);
            cameraInitPosition.set(camera.position.x, camera.position.y, camera.position.z);
            // Add rigidbody
            const robotShape = new CANNON.Box(new CANNON.Vec3(5, 5, 1.5));
            robotBody.addShape(robotShape);
            robotBody.position.x = model.position.x;
            robotBody.position.y = model.position.y;
            robotBody.position.z = model.position.z;
            robotBody.quaternion.set(model.quaternion.x,
                model.quaternion.y, model.quaternion.z, model.quaternion.w);

            world.addBody(robotBody);

            // const pointLight = new THREE.PointLight(0xff0000, 4, 100);
            // pointLight.position.set(5, 0, 0.5);
            // robot.add(pointLight);
            //const sphereSize = 1;
            // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
            // sceneRef.add(pointLightHelper);
            //const rotorMtl = new THREE.MeshPhongMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
            let materialSet = {};
            model.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true; //default is false
                    materialSet[child.material.name] = child.material;
                }

                else if (child instanceof THREE.Group) {
                    child.children.forEach(part => {
                        if (["WFR", "WFL", "WBR", "WBL"].includes(part.name)) {

                            part.children.forEach(rotor => {
                                if (rotor.name.indexOf("_rotor") > -1) {
                                    rotors.push(rotor);
                                }
                            });
                        }
                    });
                }
            });
            window.materialSet = materialSet;
            for (let i in materialSet) {
                let m = materialSet[i];

                m.side = 0;
                m.color.r = 2;
                m.color.g = 2;
                m.color.b = 2;
                m.shineness = 1000;
                m.specular.r = 0.1;
                m.specular.g = 0.1;
                m.specular.b = 0.1;
                if (m.name == 'MetalMtl') {
                    m.map = metal;
                }
                else if (m.name == 'primaryMtl') {
                    m.map = primary;
                    window.primary = m;
                }
                else if (m.name == 'secondaryMtl') {
                    m.map = secondary;
                }
                else if (m.name == 'LensMtl') {
                    m.map = lens;
                }
                else if (m.name == 'RubberMtl') {
                    m.map = rubber;
                }
            }
            sceneRef.add(model);
        });
    }
    // -------------- Scene ----------------------
    const scene = new THREE.Scene();
    // -------------- Camera ---------------------
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-15, 15, 7);
    // var cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(cameraHelper);
    // -------------- Renderer -------------------
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor("#e66e27", 1);
    renderer.setClearColor(0xffffff, 0);
    window.renderer = renderer;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;//.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // -------------- Orbital Control ------------
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 5;
    // controls.maxDistance = 20;
    //controls.minPolarAngle = 0; // radians
    // controls.maxPolarAngle = Math.PI; // radians
    //controls.maxPolarAngle = Math.PI / 2;

    // -------------Third Person Camera ----------
    var thirdPersonCamera;

    // -------------- Light ----------------------
    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 100, 0);
    light.target.position.set(111, 10, 50);
    light.castShadow = true;

    // -------------- Light Shadow ---------------
    //Set up shadow properties for the light
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    const shadowScale = 30;
    light.shadow.camera.left = -shadowScale;
    light.shadow.camera.right = shadowScale;
    light.shadow.camera.top = shadowScale;
    light.shadow.camera.bottom = -shadowScale;

    scene.add(light);
    scene.add(light.target);//Important for moving shadow.
    // const lighthelper = new THREE.DirectionalLightHelper(light, 15);
    // scene.add(lighthelper);




    // -------------- Target Circle --------------
    const targetCircle = createTarget();
    targetCircle.rotation.x = Math.PI / 2;
    scene.add(targetCircle);

    // -------------- Ground Plane ---------------

    const planeGeom = new THREE.CircleGeometry(51, 32);
    // const groundMtl = new THREE.MeshPhongMaterial({ color: 0xf2825b,specular:new THREE.Vector3(0,0,0) });    
    groundMtl = new THREE.ShadowMaterial({ opacity: 0.1 });
    groundMtl.opacity = 0.5;
    const planeObject = new THREE.Mesh(planeGeom, groundMtl);
    planeObject.rotation.set(-Math.PI / 2, 0, 0);
    planeObject.receiveShadow = true;
    scene.add(planeObject);


    const planeObject1 = new THREE.Mesh(planeGeom, groundMtl);
    // planeObject1.receiveShadow = true;
    planeObject1.rotation.set(-Math.PI / 2, 0, 0);
    planeObject1.scale.set(10, 10, 10);
    scene.add(planeObject1);

    fogColor = new THREE.Color('#f07146');

    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(fogColor, 0.02);// new THREE.Fog(fogColor, 5, 100);


    const cubeMtl = new THREE.MeshPhongMaterial({ color: 0xf2825b, specular: new THREE.Vector3(0, 0, 0) });
    let boxes = [];
    for (let i = 0; i < 10; i++) {
        const cannonBody = new CANNON.Body({ mass: 5 });
        cannonBody.angularDamping = 0.2;
        cannonBody.linearDamping = 0.2;
        const cannonBox = new CANNON.Box(new CANNON.Vec3(3, 2, 3));
        cannonBody.addShape(cannonBox);

        let c = createCube(cubeMtl);
        c.position.x += (i * 10)
        c.position.z = 101 * Math.random();
        c.position.y = 3;
        cannonBody.position.set(c.position.x, c.position.y, c.position.z);

        boxes.push([c, cannonBody]);
        world.addBody(cannonBody);
        c.receiveShadow = true;
        c.castShadow = true;
        scene.add(c);
    }
    // for (let i = 0; i < 10; i++) {
    //     let c = createCube(cubeMtl);
    //     c.position.x += (i * 10)
    //     c.position.z = -100 * Math.random();
    //     c.castShadow = true;
    //     c.receiveShadow = true;
    //     scene.add(c);
    // }

    // -------------- Ground Plane Collider ------
    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({ mass: 0 })
    planeBody.addShape(planeShape)
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.addBody(planeBody)


    // -------------- Load Quadcopter ------------
    loadQuadCopter(scene);

    // -------------- Animation ------------------
    const clock = new THREE.Clock()
    let delta;
    const getTime = () => {
        const d = new Date();
        const dd = [d.getHours(), d.getMinutes(), d.getSeconds()].map((a) => (a < 10 ? '0' + a : a));
        return dd.join(':');
    };
    const animate = function () {
        let textData = `${getTime()}<br/>POS: ${robotBody.position.x.toFixed(2)},
        ${robotBody.position.y.toFixed(2)}, ${robotBody.position.z.toFixed(2)}`;
        stats.innerHTML = textData;
        delta = Math.min(clock.getDelta(), 0.1)
        world.step(delta)
        if (isPlaying)
            requestAnimationFrame(animate);
        if (quadcopter.isEngineStart && rotors.length > 0) {
            if (robotBody.velocity.length() > 0)
                for (let i = 0; i < rotors.length; i++) {
                    rotors[i].rotation.z += delta * 50 * vel.length();
                }
        }
        if (robot && robotBody) {
            robot.position.set(robotBody.position.x, robotBody.position.y, robotBody.position.z);
            robot.quaternion.set(robotBody.quaternion.x, robotBody.quaternion.y,
                robotBody.quaternion.z, robotBody.quaternion.w);
            planeObject.position.set(robot.position.x, 0, robot.position.z);
            robotBody.velocity.x = vel.x;

            PID_pitch.setTime(delta);
            let PID_pitch_gains_adapted = throttle > 100 ? PID_pitch_gains * 2 : PID_pitch_gains;
            let pitchError = getPitchError(robotBody.position, targetPosition);
            let PID_pitch_output = PID_pitch.GetFactorFromPIDController(PID_pitch_gains_adapted, pitchError);

            PID_forward.setTime(delta);
            let PID_forward_gains_adapted = forward > 100 ? PID_forward_gains * 2 : PID_forward_gains;
            let forwardError = getForwardError(robotBody.position, targetPosition);
            let PID_forward_output = PID_forward.GetFactorFromPIDController(PID_forward_gains_adapted, forwardError);

            PID_sideway.setTime(delta);
            let PID_sideway_gains_adapted = sideway > 100 ? PID_sideway_gains * 2 : PID_sideway_gains;
            let sidewayError = getsidewayError(robotBody.position, targetPosition);
            let PID_sideway_output = PID_sideway.GetFactorFromPIDController(PID_sideway_gains_adapted, sidewayError);

            if (quadcopter.isEngineStart) {
                robotBody.velocity.x += PID_forward_output * 9.8 * 110;
                robotBody.velocity.y += PID_pitch_output * 9.8 * 10;
                robotBody.velocity.z += PID_sideway_output * 9.8 * 110;
            }
            targetCircle.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            light.position.set(robot.position.x, light.position.y, robot.position.z);
            light.target.position.set(robot.position.x, light.target.position.y, robot.position.z);
            camera.lookAt(robot.position)


        }
        if (thirdPersonCamera) {
            thirdPersonCamera.update(delta);
        }
        if (boxes.length > 0) {
            for (let i = 0; i < boxes.length; i++) {
                boxes[i][0].position.set(boxes[i][1].position.x, boxes[i][1].position.y, boxes[i][1].position.z);
            }
        }
        // controls.update();

        updateInputController();
        renderer.render(scene, camera);
    };

    function getPitchError(current, target) {
        return target.y - current.y;
    }
    function getForwardError(current, target) {
        return target.x - current.x;
    }
    function getsidewayError(current, target) {
        return target.z - current.z;
    }
    animate();
    var movementSpeed = 10;
    function updateInputController() {

        const keyTimeConstant = (1.0 - Math.pow(0.101, delta));
        if (keyMap[left[0]] || keyMap[left[1]]) {

            targetPosition.z -= keyTimeConstant * movementSpeed;

        } else if (keyMap[right[0]] || keyMap[right[1]]) {

            targetPosition.z += keyTimeConstant * movementSpeed;
        }
        if (keyMap[up[0]] || keyMap[up[1]]) {
            targetPosition.x += keyTimeConstant * movementSpeed;
        } else if (keyMap[down[0]] || keyMap[down[1]]) {
            targetPosition.x -= keyTimeConstant * movementSpeed;
        }
        if (keyMap['e']) {
        }
        if (keyMap['p']) {
            togglePause();
        }
        if (keyMap[' ']) {
            targetPosition.y += keyTimeConstant * movementSpeed;
            targetPosition.y = Math.min(targetPosition.y, 100);
        } else if (keyMap['Control']) {
            targetPosition.y -= keyTimeConstant * movementSpeed;
            targetPosition.y = Math.max(targetPosition.y, 0);
        }
    }
})();