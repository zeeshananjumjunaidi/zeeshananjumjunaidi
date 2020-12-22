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

    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#121222", 1);
    document.body.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    // const controls = new THREE.OrbitControls(camera, renderer.domElement);


    const geometry = new THREE.SphereGeometry(1, 32, 16);
    
    const earthTexture = loader.load("assets/img/earth.diffuse.2k.jpg");
    const earthAtmos = loader.load("assets/img/earth.cloud-transparent.2k.jpg");
    const earthMtl = new THREE.MeshStandardMaterial({map: earthTexture});
    const earthAtmosMtl = new THREE.MeshPhongMaterial({color:0xFFFFFF,map: earthAtmos,alphaTest: 0.5,
        transparent: true,opacity:0.3,
        side: THREE.DoubleSide,});
    const earthMesh = new THREE.Mesh(geometry, earthMtl);
    const earthAtmosMesh = new THREE.Mesh(geometry, earthAtmosMtl);
    earthAtmosMesh.scale.setScalar(1.01);
    scene.add(earthAtmosMesh);
    scene.add(earthMesh);


    // const geometry = new THREE.SphereGeometry(1, 32, 16);
    
    // const moonTexture = loader.load("assets/img/earth.diffuse.2k.jpg");
    const moonMtl = new THREE.MeshStandardMaterial({color:"white"});
    const moonMesh = new THREE.Mesh(geometry, moonMtl);
    moonMesh.position.set(3, 0, 0);
    moonMesh.scale.setScalar(0.1);
    scene.add(moonMesh);

    // earthMesh.scale.setScalar(0.8);

        
    // LIGHTING
    const light = new THREE.PointLight("white", 2.25);
    light.position.set(5, 0, 0);
    scene.add(light);

    // HELPERS
    scene.add(new THREE.PointLightHelper(light, 1));
    // scene.add(new THREE.GridHelper(50, 50));

   // camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);
     
        earthMesh.rotation.y += 0.01;
        moonMesh.rotation.y += 0.01;
        // moonMesh.rotateAround(earthMesh.position);
        // controls.update();
        renderer.render(scene, camera);
    };

    animate();

});