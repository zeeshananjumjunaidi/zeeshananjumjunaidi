

$(document).ready(() => {


    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    var boids=[];
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    const loader = new THREE.TextureLoader();
    const color = 0xEEEEEE;
    const density = 0.00001;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
    camera.position.y = 15000;
    camera.position.z = -10000;
    // camera.lookAt(new THREE.Vector3(250000, 0, 250000));
   
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
    const light = new THREE.DirectionalLight(0xffffff, 3, 20);
    light.position.set(50, 0, 45);
    light.castShadow = true; // default false
    scene.add(light);
    addGrid();
    addBoids(scene);
    var lightH = new THREE.HemisphereLight(0x404040, 0x002288, 1.5);
    scene.add(lightH);
    
    const animate = function (now) {

        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        updateBoids();
    }
    
    animate();
    function addGrid(){
        for(let i=-20;i<20;i++){
            for(let j=-20;j<20;j++){
                let clr =0xFF00FF;// `#${Math.floor(Math.random()*16777215).toString(16)}`;
               scene.add(createRect(i*1000,j*1000,1000,1000,clr));
               scene.add(createPlane(i*1000-100,1000,j*1000-100,1000-100,1000-100,`#${Math.floor(Math.random()*16777215).toString(16)}`));
            }
        }
        // scene.add(createPlane(-20000,0,-20000,1000,1000));
    }
    function addBoids(scene){
        let boid = new Boid(0,1000,0,500,1);
        boid.addToScene(scene);
        boids.push(boid);
    }
    function updateBoids(){
        for(let i=0;i<boids.length;i++){
            let boid = boids[i];           
        }
    }
});
