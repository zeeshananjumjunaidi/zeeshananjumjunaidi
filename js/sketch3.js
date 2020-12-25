const vertextShader = `
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
	float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 0.5) ), p ); 
	gl_FragColor = vec4( 0.5, 0.5, 1.7, 11 ) * intensity;
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
    camera.position.set(15, 0, 0);
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#121222", 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);
    // basic line material
    const lineMtl = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

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
    // light.shadow.camera.rotation.x=90;
    // light.shadow.camera.rotation.y=90;
    // light.shadow.camera.rotation.z=180;
    let earthText = new THREE.TextSprite({
        alignment: 'left',
        color: '#fff',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 0.7,
        fontStyle: 'italic',
        text: 'Earth'
    });
    scene.add(earthText);
    let moonText = new THREE.TextSprite({
        alignment: 'left',
        color: '#fff',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 0.3,
        fontStyle: 'italic',
        text: 'Moon'
    });
    moonText.text = "Moon";
    scene.add(moonText);

    const geometry = new THREE.SphereGeometry(1, 32, 16);

    const earthDayTexture = loader.load("assets/img/earth-day.jpg");
    const earthSpecular = loader.load("assets/img/specular.jpg");
    const earthBump = loader.load("assets/img/bump.jpg");
    const earthClouds = loader.load("assets/img/clouds.png");
    const earthNightTexture = loader.load("assets/img/earth-night.jpg");


    const moonTexture = loader.load("assets/img/2k_moon.jpg");
    const earthMtl = new THREE.MeshPhongMaterial({
        map: earthDayTexture,
        aoMap: earthClouds,
        bumpMap: earthBump,
        bumpScale: 0.08,
        specularMap: earthSpecular,
        specular: 0x777,
        emissiveMap: earthNightTexture,
        emissiveIntensity: 10,
        emissive: 1,
    });

    //new THREE.MeshStandardMaterial({map: earthTexture});



    const earthAtmosMtl = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF, map: earthClouds, alphaTest: 0.5,
        transparent: true, opacity: 1,
        side: THREE.DoubleSide,
    });
    const customMaterialAtmosphere = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                "c": { type: "f", value: 0.6 },
                "p": { type: "f", value: 3.0 }
            },
            vertexShader: vertextShader,
            fragmentShader: fragmentShader
        });



    const earthMesh = new THREE.Mesh(geometry, earthMtl);
    earthMesh.castShadow = true;
    earthMesh.scale.setScalar(3);
    scene.add(earthMesh);
    earthText.position = earthMesh.position;
    earthText.position.y += 4;

    const earthAtmosMesh = new THREE.Mesh(geometry, customMaterialAtmosphere);

    earthAtmosMesh.material.side = THREE.BackSide;
    earthAtmosMesh.scale.setScalar(3.2);
    earthAtmosMesh.position = earthMesh.position;
    scene.add(earthAtmosMesh);

    const earthCloudMesh = new THREE.Mesh(geometry, earthAtmosMtl);
    earthCloudMesh.scale.setScalar(3.05);
    earthCloudMesh.position = earthMesh.position;
    scene.add(earthCloudMesh);

    const moonGeometry = new THREE.SphereGeometry(1, 32, 16);
    moonGeometry.translate(0, 0, 0);

    const pivotPoint = new THREE.Object3D();
    const moonMtl = new THREE.MeshStandardMaterial({
        map: moonTexture,
        bump: moonTexture,
        bumpScale: 10,
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMtl);
    moonMesh.receiveShadow = true;
    moonMesh.position.set(13, 0, 0);
    moonMesh.scale.setScalar(.3);

    moonText.position.set(13, 0.5, 0);

    pivotPoint.add(moonMesh);
    pivotPoint.add(moonText);
    earthMesh.add(pivotPoint);
    scene.add(pivotPoint);

    // earthMesh.scale.setScalar(0.8);

    const points = [];
    points.push(earthMesh.position);
    points.push(moonMesh.position.clone());


    const curve = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        13, 13,           // xRadius, yRadius
        0, 2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const curvePoints = curve.getPoints(50);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    // Create the final object to add to the scene
    const ellipse = new THREE.Line(curveGeometry, curveMaterial);

    ellipse.rotation.x = Math.PI / 2;
    scene.add(ellipse);

    // scene.add(generateArc(13,13,13,17,17,17));
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dot);

    // const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    // lineGeom.attributes.position.needsUpdate = true;
    // const line = new THREE.Line(lineGeom, lineMtl);
    // scene.add(line);
    // HELPERS
    // scene.add(new THREE.PointLightHelper(light, 1));
    // scene.add(new THREE.GridHelper(50, 50));
    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );
    // camera.position.z = 5;
    // Fog
    scene.fog = new THREE.Fog(0x000011, 1, 40, 4000);


    const animate = function () {
        requestAnimationFrame(animate);

        earthMesh.rotation.y += 0.006;
        earthCloudMesh.rotation.y += 0.005;
        pivotPoint.rotation.y += 0.002;

        // moonMesh.rotateAround(earthMesh.position);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

});

function generateArc(x1, y1, z1, x2, y2, z2) {
    let d = new THREE.Vector3(x1, y1, z1).distanceTo(new THREE.Vector3(x2, y2, z2));

    let midPoint = new THREE.Vector3(x1, y1, z1).sub(new THREE.Vector3(x2, y2, z2));

    console.log(d);

    // console.log(angle);
    const curve = new THREE.EllipseCurve(
        midPoint.x, midPoint.y,            // ax, aY
        d, d,           // xRadius, yRadius
        0, Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const curvePoints = curve.getPoints(50);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    // Create the final object to add to the scene
    const ellipse = new THREE.Line(curveGeometry, curveMaterial);

    ellipse.rotation.x = Math.PI;
    return ellipse;
}