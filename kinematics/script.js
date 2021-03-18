var roboticArmRef;
var armBase,arm1,arm2,arm3;

$(document).ready(() => {

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };

    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
     camera.position.y = 10;
     camera.position.z = 20;
    


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
    rayCaster = new THREE.Raycaster();
    targetPosition = new THREE.Vector3();
    document.addEventListener(
        "click",
        function (event) { console.log(event) },
        false);
    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 5, 20);
    light.position.set(50, 51, 45);
    light.castShadow = true; // default false
    scene.add(light);

    var lightH = new THREE.HemisphereLight(0x404040, 0x002288, 1.5);
    scene.add(lightH);

    // var geo = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
    // var mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    // var plane = new THREE.Mesh(geo, mat);
    // scene.add(plane);

    // Add robotic arm
    loadRoboticArm(scene);
    const animate = function (now) {
        // console.log(now);
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        if(arm1&&arm2&&arm3&&armBase){
            // armBase.rotate(now);
            // armBase.rotation.y+=0.01;
            // console.log(now);
        }
    }

    animate();

});
function loadRoboticArm(sceneRef) {
    const loader = new THREE.FBXLoader();
    loader.load("../assets/3d/robotic_arm/robotic_arm.fbx", model => {
        console.log(model);
        model.traverse(function (child) {
            if (child instanceof THREE.Group) {       
                //  console.log(child.name);       
                if(child.name=='Base'){
                    armBase =child;
                }else if(child.name=='Arm1'){
                    arm1=child;
                }else if(child.name=='Arm2'){
                    arm2=child;
                }else if(child.name=='Arm3'){
                    arm3=child;
                }
            }
        });
        roboticArmRef=model;
        sceneRef.add(model);
    });

}
function armBaseChange(e){
    e.stopPropagation();
    e.preventDefault(); 
    if(armBase){
        armBase.rotation.y = e.target.value;
    }
}
function arm1Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(arm1){
        arm1.rotation.x = e.target.value;
    }
}
function arm2Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(arm2){
        arm2.rotation.x = e.target.value;
    }
}
function arm3Change(e){
    e.stopPropagation();
    e.preventDefault();
    if(arm3){
        arm3.rotation.x = e.target.value;
    }
}