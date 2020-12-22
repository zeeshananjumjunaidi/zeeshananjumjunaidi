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


    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    // const controls = new THREE.OrbitControls(camera, renderer.domElement);


    const geometry = new THREE.SphereGeometry(1, 32, 16);
    
    const earthTexture = loader.load("assets/img/earth.diffuse.2k.jpg");
    const material = new THREE.MeshBasicMaterial({map: earthTexture});
    const earthMesh = new THREE.Mesh(geometry, material);
    // earthMesh.position.set(25, 0, 0);
    // earthMesh.scale.setScalar(0.8);
    scene.add(earthMesh);

    camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);
     
        earthMesh.rotation.y += 0.01;

        // controls.update();
        renderer.render(scene, camera);
    };

    animate();

});