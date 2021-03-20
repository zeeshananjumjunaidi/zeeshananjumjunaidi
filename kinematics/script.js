const blas = window.BLAS;
//fetch some level3 complex 64 bit precision matrix-matrix operations
const {
    level3: { zsyrk, ztrmm, ztrsm }
} = blas;



var roboticArm;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var selectionObject;
var clicked=false;
const renderer = new THREE.WebGLRenderer({ antialias: true });

$(document).ready(() => {



    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousedown', onMouseDown, false);

    // window.requestAnimationFrame(render);

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
    camera.position.y = 100;
    camera.position.z = 40;

    //var kinematicSolver = new KinematicSolver(roboticArm, scene);
    const geometry = new THREE.CircleGeometry( 5, 32 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffee } );
    const circle = new THREE.Mesh( geometry, material );
    circle.rotation.x=-Math.PI/2;
    circle.scale.set(4,4,4);
    scene.add( circle );

    camera.up.set(0, 1, 0);
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#333", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    targetPosition = new THREE.Vector3();

    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 5, 20);
    light.position.set(50, 51, 45);
    light.castShadow = true; // default false
    scene.add(light);

    var lightH = new THREE.HemisphereLight(0x404040, 0x002288, 1.5);
    scene.add(lightH);
    // Add robotic arm
    loadRoboticArm(scene);
    const animate = function (now) {
        // console.log(now);
        requestAnimationFrame(animate);
        controls.update();
        if(!clicked){
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children,true);
          
            selectionObject=null;
            for (let i = 0; i < intersects.length; i++) {
                //console.log(i);
                // intersects[i].object.material.color.set(0xff0000);
                selectionObject=intersects[i];break;
            }        
        }
        renderer.render(scene, camera);
        if (roboticArm) {
            //     roboticArm.randomAnimate(now);
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

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    // if(clicked && selectionObject){
    // selectionObject.object.position.set(selectionObject.point.x,
    //     selectionObject.point.y,selectionObject.point.z);
    // console.log(selectionObject);
    // }
}
function onMouseUp(event){
    clicked = false;
}
function onMouseDown(event){
    clicked=true;
}