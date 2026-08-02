const vertexShader = `
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
	float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0) ), 2.0 ); 
	gl_FragColor = vec4( 0.20,0.60,0.99, 11 ) * intensity;
}`;

const DEGREE_TO_RADIAN  =Math.PI / 180;

const CURVE_MIN_ALTITUDE = 1;
const CURVE_MAX_ALTITUDE = 4;
const GLOBE_RADIUS=3;
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
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(0, 3, 5);
    camera.position.set(15, 0, 10);
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
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.minPolarAngle = 0; // radians
    // controls.maxPolarAngle = Math.PI; // radians
    controls.maxPolarAngle = Math.PI/2; 
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
  
    let orbitPointsGeom = addOrbit(scene);
    let orbitPoints=orbitPointsGeom[0];
    let geom=orbitPointsGeom[1];

    for(let i=0;i<orbitPoints.length;i++){
        orbitPoints[i].x=0;
        orbitPoints[i].y=0;
    }
    geom.updateMatrix();
    console.log(geom);
    const geometry = new THREE.SphereGeometry(1, 32, 16);

    const earthDayTexture = loader.load("../assets/img/earth-day.jpg");
    const earthSpecular = loader.load("../assets/img/specular.jpg");
    const earthBump = loader.load("../assets/img/bump.jpg");
    const earthClouds = loader.load("../assets/img/clouds.png");
    const earthNightTexture = loader.load("../assets/img/earth-night.jpg");


    const moonTexture = loader.load("../assets/img/2k_moon.jpg");
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
                color1: {
                    value: new THREE.Color("red")
                  },
                  color2: {
                    value: new THREE.Color("green")
                  },
                "c": { type: "f", value: 0.6 },
                "p": { type: "f", value: 3.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });



    const earthMesh = new THREE.Mesh(geometry, earthMtl);
    earthMesh.castShadow = true;
    earthMesh.scale.setScalar(3);
    scene.add(earthMesh);
    // earthText.position = earthMesh.position;
    // earthText.position.y += 4;

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

    pivotPoint.add(moonMesh);
    
    earthMesh.add(pivotPoint);
    scene.add(pivotPoint);

  
    // Fog
    scene.fog = new THREE.Fog(0x000011, 1, 40, 4000);

    const loader1 = new THREE.TextureLoader();
    const texture1= loader1.load(
      '../assets/img/2k_stars.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture1.image.height);
        rt.fromEquirectangularTexture(renderer, texture1);
        scene.background = rt;
      });

    const animate = function () {
        requestAnimationFrame(animate);

        earthMesh.rotation.y += 0.006;
        // for(let i=0;i<lines.length;i++){
        //     lines[i].rotation.y += 0.006;
        // }
        earthCloudMesh.rotation.y += 0.005;
        pivotPoint.rotation.y += 0.002;
        // moonMesh.rotateAround(earthMesh.position);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

});

function generateDot(x1,y1,z1){
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(x1,y1,z1));
    var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    return dot;
}

function getlSphericalNormalVector(vec){
    let _v = new THREE.Vector3(vec.x*2,vec.y*2,vec.z*2);// differentiate
    let mag = Math.sqrt(Math.pow(_v.x,2),Math.pow(_v.y,2),Math.pow(_v.z,2));
    if(mag==0)mag=1;
    return new THREE.Vector3(_v.x/mag,_v.y/mag,_v.z/mag);
}
function addNewLine(p1,p2,mtl){
        
    const points2 = [];
    points2.push( p1 );
    // points2.push( v2 );
    points2.push( p2 );

    const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
    return new THREE.Line( geometry2, mtl );
}
function latlonToSphericalProjection(lat,lon,alt){
    // ρ = altitude + radius of the planet
    let x = Math.cos(lon) * Math.sin(lat) * alt;// * 180/Math.PI;
    let y = Math.sin(lat) * Math.sin(lon) * alt ;//* 180/Math.PI;
    let z = Math.cos(lat) * alt ;//* 180/Math.PI;// z is 'up'
    return new THREE.Vector3(x,y,z);
}

const knockData = {
    
}
// https://en.wikipedia.org/wiki/Orbit_equation
function addOrbit(scene){
    const curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        4, 4,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    // Create the final object to add to the scene
    const ellipse = new THREE.Line( geometry, material );
    scene.add(ellipse);
    return [points,ellipse];
}