
var roboticArm;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var selectionObject;
var clicked = false;
const renderer = new THREE.WebGLRenderer({ antialias: true });

$(document).ready(() => {


    // THREE.Object3D.DefaultUp.set(0, 0, 1);// to use z as up axis, currently orbital control is not working properly with z up.

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousedown', onMouseDown, false);


    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);

   // camera.up.set(0, 1, 0); // Default axis, y is top. 

    //camera.up = new THREE.Vector3( 0, 0, 1 ); // we are using z'axis as top because of the IK DH table convention.
    camera.position.y = 100;
    camera.position.z = 40;


    const geometry = new THREE.CircleGeometry(5, 32);
    geometry.scale(14, 14, 14);
    const material = new THREE.MeshPhongMaterial({ 
        color: '#333333',
        shininess:0,
        reflectivity: 0,
        specular:0 });
    const circle = new THREE.Mesh(geometry, material);
    circle.receiveShadow = true;
     circle.rotation.x =-Math.PI / 2;
    // circle.scale.set(4,4,4);
    scene.add(circle);

    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#2e3d49", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    console.log(controls);
    targetPosition = new THREE.Vector3();

    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 5, 20);
    light.position.set(50, 51, 45);
    light.castShadow = true; // default false
    light.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.5, 1000);
    light.shadow.camera.up = new THREE.Vector3( 0, 0, 1 );
    scene.add(light);
    var lightH = new THREE.HemisphereLight(0x404040, 0xffffff, 5.5);
    scene.add(lightH);
    // addText(scene);

    // Add robotic arm
    loadRoboticArm(scene);
    const animate = function (now) {

        ThreeMeshUI.update();
        // console.log(now);
        requestAnimationFrame(animate);
        controls.update();
        if (!clicked) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            selectionObject = null;
            for (let i = 0; i < intersects.length; i++) {
                selectionObject = intersects[i]; break;
            }
        }
        renderer.render(scene, camera);
        if (roboticArm) {
            roboticArm.update();
        }


    }
    animate();
});

function loadRoboticArm(sceneRef) {
    roboticArm = new RoboticArm(sceneRef);
}
function armBaseChange(e) {
    e.stopPropagation();
    e.preventDefault();
    if (roboticArm.armBase) {
        roboticArm.armBase.rotation.y = e.target.value;
    }
}
function arm1Change(e) {
    e.stopPropagation();
    e.preventDefault();
    if (roboticArm.endEffector) {
        roboticArm.endEffector.rotation.x = e.target.value;
    }
}
function arm2Change(e) {
    e.stopPropagation();
    e.preventDefault();
    if (roboticArm.arm2) {
        roboticArm.arm2.rotation.x = e.target.value;
    }
}
function arm3Change(e) {
    e.stopPropagation();
    e.preventDefault();
    if (roboticArm.arm3) {
        roboticArm.arm3.rotation.x = e.target.value;
    }
}
function arm4Change(e) {
    e.stopPropagation();
    e.preventDefault();
    if (roboticArm.arm4) {
        roboticArm.arm4.rotation.x = e.target.value;
    }
}

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
}
function onMouseUp(event) {
    clicked = false;
}
function onMouseDown(event) {
    clicked = true;
}
function moveTargetX(e){
    roboticArm.target.position.x=e.target.value;
}

function moveTargetY(e){
    roboticArm.target.position.y=63.2899999+parseFloat(e.target.value);
}

function moveTargetZ(e){
     roboticArm.target.position.z=e.target.value;
}
const array = [[2, 0], [-1, 3]]               // Array
const matrix = math.matrix([[7, 1], [-2, 3]]) // Matrix

// perform a calculation on an array and matrix
math.square(array)                            // Array,  [[4, 0], [1, 9]]
math.square(matrix)                           // Matrix, [[49, 1], [4, 9]]