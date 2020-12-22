const vertextShader =`
varying vec3 vNormal;
void main() 
{
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fragmentShader = `
uniform float c;
uniform float p;
varying vec3 vNormal;
void main() 
{
	float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1 ) ), p ); 
	gl_FragColor = vec4( 0.7, 0.7, 1.0, 0.5 ) * intensity;
}
`;

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
    camera.position.set(3.5, 0,0);
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#121222", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

    document.body.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
      
    // LIGHTING
    const light = new THREE.DirectionalLight(0xffffff, 3, 100);
    light.position.set(5,0, 0);
    light.castShadow = true; // default false
    scene.add(light);
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    // light.shadow.camera.rotation.x=90;
    // light.shadow.camera.rotation.y=90;
    // light.shadow.camera.rotation.z=180;
    let instance = new THREE.TextSprite({
        alignment: 'left',
        color: '#24ff00',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 0.3,
        fontStyle: 'italic',
        text: [
          'Zeeshan Anjum Junaidi',
        ].join('\n'),
      });
      scene.add(instance);
      instance.position.y=2;
      console.log(instance);
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    
    const earthTexture = loader.load("assets/img/earth.diffuse.2k.jpg");
    const earthAtmos = loader.load("assets/img/earth.cloud-transparent.2k.jpg");
    const earthMtl = new THREE.MeshStandardMaterial({map: earthTexture});
    const earthAtmosMtl = new THREE.MeshPhongMaterial({color:0xFFFFFF,map: earthAtmos,alphaTest: 0.5,
        transparent: true,opacity:0.3,
        side: THREE.DoubleSide,});
    const customMaterialAtmosphere = new THREE.ShaderMaterial( 
        {
            uniforms:       
            { 
                "c":   { type: "f", value: 0.6 },
                "p":   { type: "f", value: 5.0 }
            },
            vertexShader:   vertextShader,
            fragmentShader: fragmentShader
        }   );



    const earthMesh = new THREE.Mesh(geometry, earthMtl);
    earthMesh.castShadow = true; 
    scene.add(earthMesh);

    // const earthAtmosMesh = new THREE.Mesh(geometry, customMaterialAtmosphere);
    // earthAtmosMesh.material.side = THREE.BackSide;
    // earthAtmosMesh.scale.setScalar(1.2);
    // scene.add(earthAtmosMesh);




     const moonGeometry = new THREE.SphereGeometry(1, 32, 16);
     moonGeometry.translate(0,0,0);

     const moonTexture = loader.load("assets/img/moon.jpg");
    const pivotPoint = new THREE.Object3D();
    const moonMtl = new THREE.MeshStandardMaterial({map:moonTexture});
    const moonMesh = new THREE.Mesh(moonGeometry, moonMtl);
    moonMesh.receiveShadow = true;
    moonMesh.position.set(3, 0, 0);
    moonMesh.scale.setScalar(0.1);

    pivotPoint.add(moonMesh);
    earthMesh.add(pivotPoint);
    scene.add(pivotPoint);

    // earthMesh.scale.setScalar(0.8);

  
    // HELPERS
    // scene.add(new THREE.PointLightHelper(light, 1));
    // scene.add(new THREE.GridHelper(50, 50));
    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );
   // camera.position.z = 5;
        // Fog
   scene.fog = new THREE.Fog( 0x000011, 1, 20, 4000 );


    const animate = function () {
        requestAnimationFrame(animate);
     
        earthMesh.rotation.y += 0.006;
        pivotPoint.rotation.y += 0.002;
        // moonMesh.rotateAround(earthMesh.position);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

});