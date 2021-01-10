
let wheels = [];
let mousePosition;
let rayCaster;
let camera;
let scene;
let targetPosition;
let vehicle;
let pathGroup;
let debugText;
let hybridAStarMap;
let vehicleRectReference;
let vehicleTargetRectReference;
let hybridFinalPath;
$(document).ready(() => {
    vehicle = new Vehicle(0, 0, 0, 6000, 1000, 0);
    let eleSpeed = document.getElementById('speed');
    let eleSteer = document.getElementById('steering');
    debugText = document.getElementById('debug');
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    pathGroup = new THREE.Group();

    // basic line material
    const lineMtl = new THREE.LineBasicMaterial({ color: 0x0000ff });

    hybridAStarMap = new HybridAStarMap(250000, 250000, 10000);

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    scene = new THREE.Scene();

    generateGrid(hybridAStarMap.rows, hybridAStarMap.cols, scene, lineMtl);
    hybridAStarMap.setVehicle(vehicle);
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
    // lineMtl.color=0x00ff00;
    // scene.add(drawRect1(0, 0, 10000, 10000, lineMtl));

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

    scene.add(pathGroup);

    loadVehicle(scene);

    scene.add(createCircle(vehicle.vLCircle.x, vehicle.vLCircle.y, vehicle.turningRadius));


    // scene.add(createGroundPlane());
    keyDown = new Array();
    for (i = 0; i < 300; i++) {
        keyDown[i] = false;
    }

    const referenceMtl = new THREE.LineBasicMaterial({ color: 0x00ffff });
    vehicleRectReference = drawRect1(0, 0, 10000, 10000, referenceMtl);
    scene.add(vehicleRectReference);
    vehicleTargetRectReference = drawRect1(0, 0, 10000, 10000, referenceMtl);
    scene.add(vehicleTargetRectReference);
    const linegeometry = new THREE.BufferGeometry().setFromPoints([]);
    
    const line = new THREE.Line(linegeometry, lineMtl);
    line.position.y = 1000;
    //    scene.remove(line);
     scene.add(line);

    let position = new THREE.Vector3();
    let steerAngle = 0;
    let heading = 0;
    let tHeading = 0;
    let dir = 1;
    const animate = function (now) {

        requestAnimationFrame(animate);
        if (car) {
            hybridAStarMap.solve();
            if (hybridAStarMap.currentCell) {
                vehicleRectReference.position.set(hybridAStarMap.currentCell.pY, 1000, hybridAStarMap.currentCell.pX);
            }
            if (hybridAStarMap.goalCell) {
                vehicleTargetRectReference.position.set(hybridAStarMap.goalCell.pY, 1000, hybridAStarMap.goalCell.pX);
            }
            // for(let i=0;i<hybridAStarMap.grid.length;i++){
            //     for(let j=0;j<hybridAStarMap.grid[i].length;j++){
            //         let hCell=hybridAStarMap.grid[i][j];
            //         if(hCell.value==3){
            //             vehicleRectReference.position.set(hCell.pX,hCell.pY);
            //         }
            //     }
            // }
            // Target position and orientation
            targetPosition.x = 0;
            targetPosition.y = 0;
            if (keyDown[38]) {//up
                targetPosition.y += 100;
                // console.log(vehicle.drivingPathCoordinates)
            } else if (keyDown[40]) {//down
                targetPosition.y -= 100;
            }
            if (keyDown[37]) {//left
                targetPosition.x += 100;
            } else if (keyDown[39]) {//right
                targetPosition.x -= 100;
            }
            tHeading = 0;
            if (keyDown[69]) {//Q
                tHeading -= 1;
            } else if (keyDown[81]) {//R
                tHeading += 1;
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
            heading += 0.4 * (steerAngle * constantVelocity) / radius;

            if (FrontLeftWheel && FrontRightWheel && BackLeftWheel && BackRightWheel) {


                const time = - performance.now() / 1000;
                for (let i = 0; i < wheels.length; i++) {
                    wheels[i].rotateOnAxis(new THREE.Vector3(1, 0, 0), dir * (speed * Math.cos(heading)) / (320.4));

                }
            }
            position.x += constantVelocity * Math.sin(heading);
            position.z += constantVelocity * Math.cos(heading);




            vehicle.drive(constantVelocity, steerAngle);
            vehicle.updateTargetControl(targetPosition, tHeading);
            vehicle.simulateDubinPath();
            vehicle.solvePath();
            //drawDrivingPath();
            // console.log(vehicle.position.x,vehicle.position.y);
            car.position.x = vehicle.position.y;//speed * Math.sin(car.rotation.y);
            car.position.z = vehicle.position.x;//speed * Math.cos(car.rotation.y);
            car.rotation.y = vehicle.heading;

            FrontLeftWheel.rotation.x = vehicle.steerAngle * 360;//.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);
            FrontRightWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);

            currentPosRect.position.x = vehicle.position.y;
            currentPosRect.position.z = vehicle.position.x;
            currentPosRect.rotation.y = vehicle.heading;

            targetPosRect.position.x = vehicle.tPosition.y;
            targetPosRect.position.y = 1000;
            targetPosRect.position.z = vehicle.tPosition.x;
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

        if(hybridAStarMap.finishedAStarPath){
        let points=getConstructedHybridAStarPath(hybridAStarMap.finishedAStarPath);
           if(points){
            linegeometry.setFromPoints(points);
            }
        }
    };
    
    animate();
    console.log(controls);
    speed = 0;

    document.onkeydown = function (event) {
        //console.log(event.keyCode);
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

                if (child.name == 'wheelFR') {
                    FrontRightWheel = child;
                    wheels.push(child);
                }
                if (child.name == 'wheelFL') {
                    FrontLeftWheel = child;
                    wheels.push(child);
                }
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
function drawRect1(x, y, w, h, mtl) {

    const points = [];
    points.push(new THREE.Vector3(x, 0, y));
    points.push(new THREE.Vector3(x, 0, y + h));
    points.push(new THREE.Vector3(x + w, 0, y + h));
    points.push(new THREE.Vector3(x + w, 0, y));
    points.push(new THREE.Vector3(x, 0, y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, mtl);
    line.position.y = 1000;
    return line;
}
isDebugStop = false;
function drawDrivingPath() {
    const material = new THREE.LineBasicMaterial({
        color: 0x00ff00
    });
    if (vehicle.drivingPathCoordinates.length > 0) {
        // strokeWeight(1);
        // noFill();
        let heading = 10;//vehicle.heading;
        let pos = vehicle.position;
        // let frame_id = 1;
        // let rects = [];//pathGroup.clear();
        pathGroup.remove(...pathGroup.children);
        for (let i = 0; i < vehicle.drivingPathCoordinates.length; i += 100) {
            let p = vehicle.drivingPathCoordinates[i];
            if (p.segmentIndex == 1) {
                material.color.r = 255;
                material.color.g = 0;
                material.color.b = 0;
                //   stroke(0, 255, 0, 50);
            } else if (p.segmentIndex == 2) {
                material.color.r = 0;
                material.color.g = 255;
                material.color.b = 0;//continue;
                //    stroke(0, 255, 255, 50);
                //    material.color=0x00ff00;
            } else {
                material.color.r = 255;
                material.color.g = 0;
                material.color.b = 255;
                //     stroke(255, 255, 0, 50);
                // material.color=0xff00ff;
            }
            if (i % 100 == 0 || i == vehicle.drivingPathCoordinates.length - 1 || i == 0) {
                let dr = drawRect1(pos.y, pos.x, 3000, 5000, material);
                //   dr.rotation=new THREE.Vector3(0,p.heading != undefined ? p.heading : heading,0);
                if (!isDebugStop & i == 30) {
                    console.log(heading);
                    isDebugStop = true;
                }
                pathGroup.add(dr);
                //pos = new THREE.Vector2(p.x,p.y);
                // if (i == 0 && (!vehicle.alwaysSolve || vehicle.autoPilot)) { continue; }
                // push();
                // translate(pos);
                // rotate(p.heading != undefined ? p.heading : heading);
                // rect(0, 0, 50, 30, 2);
                // text(frame_id++, 0, -6);
                // pop();
            }
            // 
            // heading +=p.heading+ Math.atan2(p.y - pos.y, p.x - pos.x);
            // debugText.innerText=heading;
            pos = new THREE.Vector2(p.x, p.y);
            // point(p.x,p.y);
        }
    }
}
function rotatePoint(cx, cy, angle, centerPoint) {
    let p = new THREE.Vector2(centerPoint.x, centerPoint.y);
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    // translate point back to origin:
    p.x -= cx;
    p.y -= cy;

    // rotate point
    let xnew = p.x * c - p.y * s;
    let ynew = p.x * s + p.y * c;

    // translate point back:
    p.x = xnew + cx;
    p.y = ynew + cy;
    return p;
}

function createCircle(x, y, radius = 10) {
    const curve = new THREE.EllipseCurve(
        x, y,            // ax, aY
        radius, radius,           // xRadius, yRadius
        0, 2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const points = curve.getPoints(radius);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // Create the final object to add to the scene
    const ellipse = new THREE.Line(geometry, material);
    ellipse.rotation.x = Math.PI / 2;
    return ellipse;
}

function generateGrid(cols, rows, scene, mtl, size = 10000) {
    for (let i = -cols; i < cols; i++) {
        for (let j = -rows; j < rows; j++) {
            scene.add(drawRect1(i * size + size / 2, j * size + size / 2, size, size, mtl));
        }
    }
}


function getConstructedHybridAStarPath(path){
    if(path && path.length>2 ){
        const points = [];
        for(let i=0;i<path.length;i++){
            points.push(new THREE.Vector3(path[i].y,1000,path[i].x));
        }
        return points
    }
    return null;
}