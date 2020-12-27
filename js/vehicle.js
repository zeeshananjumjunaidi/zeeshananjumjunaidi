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

    camera.position.set(0, 3, 5);
    camera.position.set(15, 10, 10);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#121222", 1);
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

    const animate = function () {
        requestAnimationFrame(animate);
        if(car){
        camera.lookAt(car);
            // car.position.x = Math.cos(heading)*10;
            // car.rotation.x+=(heading);
     }
        
        controls.update();
        renderer.render(scene, camera);
    };
    animate();


console.log("ASD")
// movement - please calibrate these values
var xSpeed = 0.4;
var ySpeed = 0.0004;
var heading = 0;
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
        car.position.z += ySpeed;
    } else if (keyCode == 40) {
        car.position.z -= ySpeed;
    } else if (keyCode == 37) {
        heading -= xSpeed;
    } else if (keyCode == 39) {
        heading += xSpeed;
    } else if (keyCode == 32) {
        car.position.set(0, 0, 0);
    }
};




});
var car=undefined;
function createGroundPlane(){
    var geo = new THREE.PlaneBufferGeometry(500, 500, 8, 8);
    var mat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat);plane.rotateX( - Math.PI / 2);
    return plane;
}
function loadVehicle(sceneRef){
    let texture =  new THREE.TextureLoader().load( '../assets/3d/audi/Audi R8-black.jpg' );
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
          car=model;
          objs.push({model, mixer});
      });
}
