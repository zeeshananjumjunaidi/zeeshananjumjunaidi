$(document).ready(() => {

    let eleSpeed = document.getElementById('speed');
    let eleSteer = document.getElementById('steering');

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
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

    const lightAmbient = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( lightAmbient );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add(light);

    loadVehicle(scene);

    scene.add(createGroundPlane());
    keyDown = new Array();
    for (i = 0; i < 300; i++) {
        keyDown[i] = false;
    }
    let position = new THREE.Vector3();
    let steerAngle=0;
    let heading=0;
    const animate = function (now) {

        requestAnimationFrame(animate);
        if (car) {

            if (keyDown[87]) {
                if (speed < 130) {
                    speed += 1;
                }
            } else if (keyDown[83]) {
                
                if (speed >-60) {
                speed -= 2;}
            } else {
                speed*=0.9;
                if (Math.abs(speed) < 1) speed = 0;
            }
            if (speed != 0) {
                if (keyDown[65]) steerAngle += 0.001;
                if (keyDown[68]) steerAngle -= 0.001;
            }
            let radius = 20 / 2;
            constantVelocity = speed*5; //constant velocity
            heading += 0.4* (steerAngle * this.constantVelocity) / radius;
            if(leftWheel&&rightWheel){
                // leftWheel.rotation.y+=0.01;
                // rightWheel.rotation.y=heading;
            }
            position.x += constantVelocity * Math.sin(heading);
            position.z += constantVelocity * Math.cos(heading);



            car.position.x =  position.x;//speed * Math.sin(car.rotation.y);
            car.position.z =  position.z;//speed * Math.cos(car.rotation.y);
            car.rotation.y=heading;
            steerAngle*=0.5;
            camera.lookAt(car.position);

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
    var mat = new THREE.MeshBasicMaterial({ color: 0xAAAAAA, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat); plane.rotateX(- Math.PI / 2);
    
    plane.scale.x = plane.scale.y = plane.scale.z = 2000;
    return plane;
}
var leftWheel;
var rightWheel;
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
        });
        model.traverse(function (child) {
            if (child instanceof THREE.Group) {
                if(child.name=='wheelR'){rightWheel=child;}
                if(child.name=='wheelL'){leftWheel=child;}
            }
            
            if (child instanceof THREE.Mesh) {
                // apply texture
                child.material = material;
              //  child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
        const mixer = new THREE.AnimationMixer(model);
        // animations is a list of THREE.AnimationClip                          
        //mixer.clipAction(model.animations[0]).play();
        sceneRef.add(model);
        car = model;
        car.scale.x = car.scale.y = car.scale.z = 100;
        objs.push({ model });
    });
}
