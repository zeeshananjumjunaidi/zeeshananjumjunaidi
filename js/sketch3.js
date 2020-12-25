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
  
    let v1 =new THREE.Vector3(2.25,2.25,0);
    let v2 =new THREE.Vector3(-2.25,2.25,0);

    

    scene.add(generateDot(v1.x,v1.y,v1.z));
    scene.add(generateDot(v2.x,v2.y,v2.z));



    const points1 =  getSplineFromCoords([0,0,100,14]).spline.getPoints( 50 );
    const geometry1 = new THREE.BufferGeometry().setFromPoints( points1 );

    const material1 = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    const curveObject1 = new THREE.Line( geometry1, material1 );

    scene.add(curveObject1)
    // scene.add(generateDot(-2.25,-2.25,0));
    // scene.add(generateDot(2.25,-2.25,0));

    

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

function generateDot(x1,y1,z1){
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(x1,y1,z1));
    var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    return dot;
}

// Credit: https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
function getSplineFromCoords(coords) {
    const startLat = coords[0];
    const startLng = coords[1];
    const endLat = coords[2];
    const endLng = coords[3];
    console.log(startLat,startLng);
    // start and end points
    const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
    const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
   
    // altitude
    const altitude = clamp(start.distanceTo(end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
    
    // 2 control points
    // const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
    const midCoord1 = start.sub(end).multiplyScalar (0.25);
    const midCoord2 = end.sub(start).multiplyScalar (0.75);
    // const midCoord2 = interpolate(0.75);
    const mid1 = coordinateToPosition(midCoord1.x,midCoord1.y, GLOBE_RADIUS + altitude);
    const mid2 = coordinateToPosition(midCoord2.x,midCoord2.y, GLOBE_RADIUS + altitude);
   
    return {
      start,
      end,
      spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end)
    };
  }

  function latLonTo3d(lat,lon,alt){
    let rad = 3;//     
    let x = rad* Math.cos(lat) * Math.sin(lon);
    let y = rad* Math.sin(lat) * Math.sin(lon);
    let z = rad* Math.cos(lon);
    return 
  }
 function coordinateToPosition(lat, lng, radius) {
    const phi = (90 - lat) * DEGREE_TO_RADIAN;
    const theta = (lng + 180) * DEGREE_TO_RADIAN;
  
    return new THREE.Vector3(
      - radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  function clamp(num, min, max) {
    return num <= min ? min : (num >= max ? max : num);
  }