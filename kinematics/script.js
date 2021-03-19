const blas = window.BLAS;
//fetch some level3 complex 64 bit precision matrix-matrix operations
const {
    level3: { zsyrk, ztrmm, ztrsm }
 } = blas;
 
var roboticArm;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
$(document).ready(() => {

    

    window.addEventListener( 'mousemove', onMouseMove, false );

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
    
    var kinematicSolver =new KinematicSolver(roboticArm,scene);


    camera.up.set(0,1,0);
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#333", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    //rayCaster = new THREE.Raycaster();
    targetPosition = new THREE.Vector3();
    // document.addEventListener(
    //     "click",
    //     function (event) { console.log(event) },
    //     false);
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

        raycaster.setFromCamera(mouse, camera );
        const intersects = raycaster.intersectObjects( scene.children );
        for ( let i = 0; i < intersects.length; i ++ ) {
            console.log(i)
            intersects[ i ].object.material.color.set( 0xff0000 );
    
        }

        renderer.render(scene, camera);
        if(roboticArm){
       //     roboticArm.randomAnimate(now);
        }
        
    
    }

    animate();

});

function loadRoboticArm(sceneRef) {
    roboticArm = new RoboticArm(sceneRef);
}
function armBaseChange(e){
    e.stopPropagation();
    e.preventDefault(); 
    if(roboticArm.armBase){
        roboticArm.armBase.rotation.y = e.target.value;
    }
}
function arm1Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(roboticArm.arm1){
        roboticArm.arm1.rotation.x = e.target.value;
    }
}
function arm2Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(roboticArm.arm2){
        roboticArm.arm2.rotation.x = e.target.value;
    }
}
function arm3Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(roboticArm.arm3){
        roboticArm.arm3.rotation.x = e.target.value;
    }
}

function onMouseMove( event ) {
    	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // console.warn(mouse);
}
