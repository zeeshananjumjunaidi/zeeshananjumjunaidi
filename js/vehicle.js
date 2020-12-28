$(document).ready(() => {
    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //camera.position.set(0, 3, 5);

    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    camera.position.set(0, 10, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#EEE", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // basic line material
    //const lineMtl = new THREE.LineBasicMaterial({ color: 0x0000ff });
    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 3, 100);
    light.position.set(50, 0, 0);
    light.castShadow = true; // default false
    scene.add(light);
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add(light);

    loadVehicle(scene);

    scene.add(createGroundPlane());
    let then = 0;
    const animate = function (now) {
        now *= 0.001;  // make it seconds                
        const delta = now - then;
        then = now;
        requestAnimationFrame(animate);
        if (car) {
            // console.log(then,now,delta);
            let pwr = ySpeed;
            heading+=steering *pwr*100;
            car.position.x += Math.sin(heading) *pwr ;// delta*0.0001;
            car.position.z += Math.cos(heading) * pwr;
            
            car.rotation.y = heading;
            // console.log(heading);
                // camera.position.x=car.position.x;
                // camera.position.z=car.position.z;                
               // camera.position.y=car.position.y+23; 
                ySpeed*=0.99;
                steering*=0.7;
        }

        controls.update();
        renderer.render(scene, camera);
    };
    animate();


    console.log("ASD")
    // movement - please calibrate these values
    var xSpeed = 0.0;
    var ySpeed = 0.0;
    var heading = 0;
    var steering = 0;
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 38) {
            ySpeed+=0.005;
        } else if (keyCode == 40) {
            ySpeed-=0.005;

        } else if (keyCode == 37) {
            steering -= 0.01;
        } else if (keyCode == 39) {
            steering += 0.01;
        } else if (keyCode == 32) {
            car.position.set(0, 0, 0);
        }
    };




});
var car = undefined;
function createGroundPlane() {
    var geo = new THREE.PlaneBufferGeometry(500, 500, 8, 8);
    var mat = new THREE.MeshBasicMaterial({ color: 0xAAAAAA, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat); plane.rotateX(- Math.PI / 2);
    return plane;
}
function loadVehicle(sceneRef) {
    let texture = new THREE.TextureLoader().load('../assets/3d/audi/Audi R8-black.jpg');
    // load fbx model and texture                                               
    const objs = [];
    const loader = new THREE.FBXLoader();
    loader.load("../assets/3d/audi/Audi_R8.fbx", model => {
        // model is a THREE.Group (THREE.Object3D)       
        console.log(model);

        const material = new THREE.MeshPhongMaterial({
            color: 0xFF0000,    // red (can also use a CSS color string here)
            flatShading: true,
        });
        model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {

                // apply texture
                child.material = material;
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
        const mixer = new THREE.AnimationMixer(model);
        // animations is a list of THREE.AnimationClip                          
        //mixer.clipAction(model.animations[0]).play();
        sceneRef.add(model);
        car = model;
        objs.push({ model, mixer });
    });
}
