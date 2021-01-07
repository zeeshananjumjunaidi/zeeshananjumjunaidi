
let wheels = [];
let mousePosition;
let rayCaster;
let camera;
let scene;
let targetPosition;
let vehicle;
$(document).ready(() => {
    vehicle = new Vehicle(0,0,0,1000,1000,0);
    vehicle.simulateDubinPath();
    let eleSpeed = document.getElementById('speed');
    let eleSteer = document.getElementById('steering');
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
    camera.position.y = 5000;
    camera.position.z = -5000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    //camera.position.set(0, 3, 5);

    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#EEE", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    rayCaster = new THREE.Raycaster();
    targetPosition = new THREE.Vector2();
    document.addEventListener(
        "click",
        function (event) { console.log(event) },
        false);
    // basic line material
    //const lineMtl = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 3, 100);
    light.position.set(50, 0, 0);
    light.castShadow = true; // default false
    scene.add(light);

    const light1 = new THREE.DirectionalLight(0xffffff, 3, 30);
    light1.position.set(0, 0, 50);
    scene.add(light1);

    const lightAmbient = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(lightAmbient);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add(light);
    let currentPosRect = createRect(0x0000ff);
    scene.add(currentPosRect);

    let targetPosRect = createRect(0xff0000);
    scene.add(targetPosRect);

    loadVehicle(scene);

    scene.add(createGroundPlane());
    keyDown = new Array();
    for (i = 0; i < 300; i++) {
        keyDown[i] = false;
    }
    let position = new THREE.Vector3();
    let steerAngle = 0;
    let heading = 0;
    let tHeading = 0;
    let dir = 1;
    const animate = function (now) {

        requestAnimationFrame(animate);
        if (car) {
            // Target position and orientation
            targetPosition.x=0;
            targetPosition.y=0;
            if (keyDown[38]) {//up
                targetPosition.y +=100;console.log(vehicle.pathDataList);
            } else if (keyDown[40]) {//down
                targetPosition.y -= 100;
            }
            if (keyDown[37]) {//left
                targetPosition.x += 100;
            } else if (keyDown[39]) {//right
                targetPosition.x -=100;
            }
            tHeading=0;
            if (keyDown[69]) {//Q
                tHeading -=  1;
            } else if (keyDown[81]) {//R
                tHeading +=1;
            }


            // console.log(targetPosition);
            if (keyDown[87]) {
                if (speed < 130) {
                    speed += 1;
                    dir = 1;
                }
            } else if (keyDown[83]) {

                if (speed > -60) {
                    speed -= 2;
                    dir = -1;
                }
            } else {
                speed *= 0.9;
                if (Math.abs(speed) < 1) speed = 0;
            }
            if (speed != 0) {
                if (keyDown[65]) steerAngle += 0.001;
                if (keyDown[68]) steerAngle -= 0.001;
            }
            let radius = 20 / 2;
            constantVelocity = speed * 5; //constant velocity
            heading += 0.4 * (steerAngle * this.constantVelocity) / radius;
       
            if (FrontLeftWheel && FrontRightWheel && BackLeftWheel && BackRightWheel) {
  

                const time = - performance.now() / 1000;
                for (let i = 0; i < wheels.length; i++) {
                    wheels[i].rotateOnAxis(new THREE.Vector3(1, 0, 0), dir * (speed * Math.cos(heading)) / (320.4));

                }
            }
            position.x += constantVelocity * Math.sin(heading);
            position.z += constantVelocity * Math.cos(heading);



            
            vehicle.drive(constantVelocity,steerAngle);
            vehicle.updateTargetControl(targetPosition, tHeading);
            // console.log(vehicle.position.x,vehicle.position.y);
            car.position.x = vehicle.position.y;//speed * Math.sin(car.rotation.y);
            car.position.z = vehicle.position.x;//speed * Math.cos(car.rotation.y);
            car.rotation.y = vehicle.heading;

                FrontLeftWheel.rotation.x=vehicle.steerAngle*360;//.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);
                FrontRightWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);

            currentPosRect.position.x = vehicle.position.y;
            currentPosRect.position.z = vehicle.position.x;
            currentPosRect.rotation.y = vehicle.heading;

            targetPosRect.position.x=vehicle.tPosition.y;
            targetPosRect.position.y=1000;
            targetPosRect.position.z=vehicle.tPosition.x;
            targetPosRect.rotation.y = vehicle.tHeading;

            steerAngle *= 0.5;
            camera.lookAt(car.position);
            controls.center.set(car.position.x, car.position.y, car.position.z);
            //camera.position.x=car.position.x+0;
            //camera.position.y=car.position.y+6100;
            //camera.position.z=car.position.z-8500;
            renderer.render(scene, camera);
        }
        if (eleSpeed)
            eleSpeed.innerText = "Speed: " + speed;
        if (eleSteer)
            eleSteer.innerText = "Steer: " + speed;
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
    console.log(controls);
    speed = 0;

    document.onkeydown = function (event) {
        console.log(event.keyCode);
        keyDown[event.keyCode] = true;
    }

    document.onkeyup = function (event) {
        keyDown[event.keyCode] = false;
    }



});
var car = undefined;
function createGroundPlane() {
    var geo = new THREE.PlaneBufferGeometry(500, 500, 8, 8);
    let texture = new THREE.TextureLoader().load('../assets/img/ground_grid.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0xAAAAAA, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat); plane.rotateX(- Math.PI / 2);

    plane.scale.x = plane.scale.y = plane.scale.z = 2000;
    return plane;
}

var FrontLeftWheel;
var FrontRightWheel;
var BackLeftWheel;
var BackRightWheel;
function loadVehicle(sceneRef) {
    // let texture = new THREE.TextureLoader().load('../assets/3d/military/Audi R8-black.jpg');
    // load fbx model and texture                                               
    const objs = [];
    const loader = new THREE.FBXLoader();
    loader.load("../assets/3d/military/vehicle.fbx", model => {
        // model is a THREE.Group (THREE.Object3D)       
        console.log(model);

        const material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,    // red (can also use a CSS color string here)
            flatShading: true,
            combine: 100
        });
        model.traverse(function (child) {
            if (child instanceof THREE.Group) {

                if (child.name == 'wheelFR') { FrontRightWheel = child; 
                    wheels.push(child); }
                if (child.name == 'wheelFL') { FrontLeftWheel = child;
                     wheels.push(child); }
                if (child.name == 'wheelBR') { BackRightWheel = child; wheels.push(child); }
                if (child.name == 'wheelBL') { BackLeftWheel = child; wheels.push(child); }

            }

            if (child instanceof THREE.Mesh) {
                // apply texture
                //  child.material = material;
                //  child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });

        //const mixer = new THREE.AnimationMixer(model);
        // animations is a list of THREE.AnimationClip                          
        //mixer.clipAction(model.animations[0]).play();
        sceneRef.add(model);

        car = model;
        car.scale.x = car.scale.y = car.scale.z = 100;
        objs.push({ model });
    });
}
function createRect(clr) {
    const width = 3000;
    const height = 5500;
    const material = new THREE.LineBasicMaterial({
        color: clr
    });

    const points = [];
    points.push(new THREE.Vector3(-width, 0, -height));
    points.push(new THREE.Vector3(-width, 0, height));
    points.push(new THREE.Vector3(width, 0, height));
    points.push(new THREE.Vector3(width, 0, -height));
    points.push(new THREE.Vector3(-width, 0, -height));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.translate(0, 0, 2000);
    const line = new THREE.Line(geometry, material);
    line.position.y = 100;
    return line;
}
