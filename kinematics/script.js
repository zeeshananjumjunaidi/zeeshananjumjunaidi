
$(document).ready(() => {

    const settings = {
        animate: true,
        context: "webgl",
        scaleToView: true
    };
    
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 700000);
    camera.position.y = 15000;
    camera.position.z = -10000;

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


});