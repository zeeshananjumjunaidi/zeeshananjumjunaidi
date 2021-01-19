
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
let heuristicLinePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
$(document).ready(() => {
    vehicle = new Vehicle(20000, 1000, 20000, 0, 60000, 1000, 20000, 0);
    let eleSpeed = document.getElementById('speed');
    let eleSteer = document.getElementById('steering');
    debugText = document.getElementById('debug');
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    pathGroup = new THREE.Group();

    loadFont();
    // basic line material
    const lineMtl = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const blkMtl = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const pathMtl = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    hybridAStarMap = new HybridAStar3d(350000, 350000, 10000);

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    scene = new THREE.Scene();

    generateGrid(hybridAStarMap, scene, lineMtl, blkMtl, pathMtl,25000);
    hybridAStarMap.setVehicle(vehicle);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
    camera.position.y = 15000;
    camera.position.z = -35000;
    camera.lookAt(new THREE.Vector3(250000, 0, 250000));
    const color = 0xEEEEEE;
    const density = 0.00001;
    //    scene.fog = new THREE.FogExp2(color, density);
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
    targetPosition = new THREE.Vector3();
    document.addEventListener(
        "click",
        function (event) { console.log(event) },
        false);

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
    vehicleRectReference = drawRect1(0, 0, 10000 - 2000, 10000 - 2000, referenceMtl);
    scene.add(vehicleRectReference);
    vehicleTargetRectReference = drawRect1(0, 0, 10000 - 2000, 10000 - 2000, referenceMtl);
    scene.add(vehicleTargetRectReference);

    const linegeometry = new THREE.BufferGeometry().setFromPoints([]);
    const line = new THREE.Line(linegeometry, lineMtl);
    line.position.y = 1000;
    scene.add(line);

    const heuristicLineGeom = new THREE.BufferGeometry().setFromPoints([]);
    const heuristicLine = new THREE.Line(heuristicLineGeom, blkMtl);
    heuristicLine.position.y = 1000;
    heuristicLineGeom.frustumCulled = false;
    heuristicLine.frustumCulled = false;
    scene.add(heuristicLine);
    console.log(heuristicLineGeom);
    console.log(heuristicLine);

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
                vehicleRectReference.position.set(hybridAStarMap.currentCell.pX - 4000, 1000, hybridAStarMap.currentCell.pZ - 4000);
            }
            if (hybridAStarMap.goalCell) {
                vehicleTargetRectReference.position.set(hybridAStarMap.goalCell.pX - 4000, 1000, hybridAStarMap.goalCell.pZ - 4000);
            }
            // Target position and orientation
            targetPosition.x = 0;
            targetPosition.z = 0;
            if (keyDown[38]) {//up
                targetPosition.z += 400;
                // console.log(vehicle.drivingPathCoordinates)
            } else if (keyDown[40]) {//down
                targetPosition.z -= 400;
            }
            if (keyDown[37]) {//left
                targetPosition.x += 400;
            } else if (keyDown[39]) {//right
                targetPosition.x -= 400;
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
            car.position.x = vehicle.position.x;//speed * Math.sin(car.rotation.y);
            car.position.z = vehicle.position.z;//speed * Math.cos(car.rotation.y);
            car.rotation.y = vehicle.heading;

            FrontLeftWheel.rotation.x = vehicle.steerAngle * 360;//.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);
            FrontRightWheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 * steerAngle);

            currentPosRect.position.x = vehicle.position.x;
            currentPosRect.position.z = vehicle.position.z;
            currentPosRect.rotation.y = vehicle.heading;
            heuristicLinePoints[0].x = vehicle.position.z;
            heuristicLinePoints[0].z = vehicle.position.x;
            targetPosRect.position.x = vehicle.tPosition.x;
            targetPosRect.position.y = 1000;
            targetPosRect.position.z = vehicle.tPosition.z;
            targetPosRect.rotation.y = vehicle.tHeading;
            heuristicLinePoints[1].x = vehicle.tPosition.x;
            heuristicLinePoints[1].z = vehicle.tPosition.z;

            steerAngle *= 0.5;
            camera.lookAt(car.position);
            controls.center.set(car.position.x, car.position.y, car.position.z);
            renderer.render(scene, camera);
        }
        if (eleSpeed)
            eleSpeed.innerText = "Speed: " + speed;
        if (eleSteer)
            eleSteer.innerText = "Steer: " + speed;
        controls.update();
        renderer.render(scene, camera);

        if (hybridAStarMap.finishedAStarPath) {
            let points = getConstructedHybridAStarPath(hybridAStarMap.finishedAStarPath);
            if (points) {
                linegeometry.setFromPoints(points);
                line.geometry.verticesNeedUpdate = true;
            }
        }
        if (heuristicLinePoints.length == 2) {
            heuristicLineGeom.setFromPoints(heuristicLinePoints);
            heuristicLineGeom.needsUpdate = true;
        }

    };

    animate();
    console.log(controls);
    speed = 0;

    document.onkeydown = function (event) {
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
    // load fbx model and texture                                               
    const objs = [];
    const loader = new THREE.FBXLoader();
    loader.load("../assets/3d/military/vehicle.fbx", model => {
        console.log(model);
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

                let toonMtl = new THREE.MeshToonMaterial({
                    color: 0xaaaaaa, fog: true
                    , blending: 1
                    , side: 0
                    , flatShading: false
                    , vertexColors: false
                    , opacity: 1
                    , transparent: true
                    , blendSrc: 204
                    , blendDst: 205
                    , blendEquation: 100
                    , blendSrcAlpha: null
                    , blendDstAlpha: null
                    , blendEquationAlpha: null
                    , depthFunc: 3
                    , depthTest: true
                    , depthWrite: true
                    , stencilWriteMask: 255
                });
                
                if (child.material.map)
                    if (child.material.map.image) {
                        toonMtl.map = child.material.map;
                    }
                // child.material = toonMtl;

                child.material.needsUpdate = true;
            }
        });
        sceneRef.add(model);

        car = model;
        car.traverse(function (child) {

            if(child instanceof THREE.Mesh){
                if(child.children.length>0){
                    console.log(child.children);
                }console.log(child.name,child.material.map);
                if(child.name=="MainBody"){
                    console.log(child.material.map.image);
                }
                if(child.material.map&&child.material.map.image){
                    console.error("ASDASD");
                }
            }
        });
        let toonMtl = new THREE.MeshToonMaterial({
            color: 0xaaaaaa, fog: true
            , blending: 1
            , side: 0
            , flatShading: false
            , vertexColors: false
            , opacity: 1
            , transparent: true
            , blendSrc: 204
            , blendDst: 205
            , blendEquation: 100
            , blendSrcAlpha: null
            , blendDstAlpha: null
            , blendEquationAlpha: null
            , depthFunc: 3
            , depthTest: true
            , depthWrite: true
            , stencilWriteMask: 255
        });
        // car.material = toonMtl;
        console.log(car);
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
        let heading = 10;
        let pos = vehicle.position;
        pathGroup.remove(...pathGroup.children);
        for (let i = 0; i < vehicle.drivingPathCoordinates.length; i += 100) {
            let p = vehicle.drivingPathCoordinates[i];
            if (p.segmentIndex == 1) {
                material.color.r = 255;
                material.color.g = 0;
                material.color.b = 0;
            } else if (p.segmentIndex == 2) {
                material.color.r = 0;
                material.color.g = 255;
                material.color.b = 0;
            } else {
                material.color.r = 255;
                material.color.g = 0;
                material.color.b = 255;
            }
            if (i % 100 == 0 || i == vehicle.drivingPathCoordinates.length - 1 || i == 0) {
                let dr = drawRect1(pos.y, pos.x, 3000, 5000, material);
                if (!isDebugStop & i == 30) {
                    console.log(heading);
                    isDebugStop = true;
                }
                pathGroup.add(dr);

            }
            pos = new THREE.Vector3(p.x, 1000, p.y);
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

function generateGrid(hybridAStarMap, scene, mtl, blkMtl, pathMtl, size = 10000) {
    size = hybridAStarMap.cellSize;
    for (let i = 0; i < hybridAStarMap.cols; i++) {
        for (let j = 0; j < hybridAStarMap.rows; j++) {
            let c = hybridAStarMap.grid[i][j];
            let m = mtl;
            if (c.value == 2) {
                m = pathMtl;
            } else if (c.isBlocked) {
                m = blkMtl;
            }
            scene.add(drawRect1(i * size - size / 2, j * size - size / 2, size, size, m));
        }
    }
    //25000, y: 1000, z: 55000
    //x: 55000, y: 1000, z: 65000
    //-35000, y: 1000, z: -65000
    scene.add(drawRect1(0, 0, 5000, 5000, blkMtl));
    scene.add(drawRect1(350000, 350000, 5000, 5000, blkMtl));
}


function getConstructedHybridAStarPath(path) {
    if (path && path.length > 2) {
        const points = [];
        for (let i = 0; i < path.length; i++) {
            points.push(new THREE.Vector3(path[i].pX, 1000, path[i].pZ));
        }
        return points
    }
    return null;
}

/** Helper Functions  */
var text = "aems",
    height = 223,
    size = 1000,
    curveSegments = 10,
    bevelThickness = 1,
    bevelSize = 0.3,
    bevelSegments = 3,
    bevelEnabled = true,
    font = undefined;

var cubeMat = new THREE.MeshLambertMaterial({ color: 0xff3300 })
// Credit - https://github.com/chalupagrande/threejs-text-example
function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('js/fonts/helvetiker_regular.typeface.js', function (res) {
        font = res;
        // createText('1,3',0,1000,0);
    });
}

function createText(v, x, y, z) {
    textGeo = new THREE.TextGeometry(v, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        weight: "normal",
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelSegments: bevelSegments,
        bevelEnabled: bevelEnabled
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var text = new THREE.Mesh(textGeo, cubeMat)
    text.position.x = x - textGeo.boundingBox.max.x / 2;
    text.position.y = y;
    text.position.z = z - textGeo.boundingBox.max.x / 2;
    text.rotation.x = Math.PI / 2;
    text.rotation.y = Math.PI;
    text.castShadow = true;
    scene.add(text);
}
function createSphere(x, y) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.z = y;
    return sphere;
}