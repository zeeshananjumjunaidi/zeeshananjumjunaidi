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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x00fff0 });

    // Create the final object to add to the scene
    const ellipse = new THREE.Line(curveGeometry, curveMaterial);

    ellipse.rotation.x = Math.PI / 2;
    scene.add(ellipse);

    // scene.add(generateArc(13,13,13,17,17,17));
  
    /// LatLon test
    // let v1 =new THREE.Vector3(2.25,2.25,0);
    // let v2 =new THREE.Vector3(-2.25,2.25,0);
    // let v3 =new THREE.Vector3((v1.x+v2.x)/2,(v1.y+v2.y)/2,(v1.z+v2.z)/2);

    // let nv1 =  getlSphericalNormalVector(v1,3).multiplyScalar(3);
    // let nv2 =  getlSphericalNormalVector(v2,3).multiplyScalar(3);
    // let nv3 =  getlSphericalNormalVector(v3,3).multiplyScalar(1);

    let lines= [];
    let randomPoints =[];
    for(let i=0;i<30;i++){
        let q2 = latlonToSphericalProjection(Math.random(0,180),Math.random(0,360),3);
        let nq2 =  getlSphericalNormalVector(q2,3).normalize().multiplyScalar(4);
        let l2 = addNewLine(q2,nq2,curveMaterial);
        lines.push(l2);
        scene.add(l2);
    }
    // USA 37.0902° N, 95.7129° W
    // let q2 = latlonToSphericalProjection(37.0902,95.7129,3);
    // let nq2 =  getlSphericalNormalVector(q2,3).normalize().multiplyScalar(4);
    // let l2 = addNewLine(q2,nq2,curveMaterial);
    // lines.push(l2);
    // scene.add(l2);
    // Pakistan
    let q1 = latlonToSphericalProjection(30.3753,69.3451,1);
    let nq1 =  getlSphericalNormalVector(q1,3).multiplyScalar(2);
    let l = addNewLine(q1,nq1,curveMaterial);
    lines.push(l);
    scene.add(l);

    // scene.add(addNewLine(v1,nv1,curveMaterial));
    // scene.add(addNewLine(v2,nv2,curveMaterial));
    // scene.add(addNewLine(v3,nv3,curveMaterial));

    // scene.add(generateDot(v1.x,v1.y,v1.z));
    // scene.add(generateDot(v2.x,v2.y,v2.z));
    // scene.add(generateDot(v3.x,v3.y,v3.z));
   


    /// End of LatLon test



    // const points1 =  getSplineFromCoords([0,0,100,14]).spline.getPoints( 50 );
    // const geometry1 = new THREE.BufferGeometry().setFromPoints( points1 );

    // const material1 = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // // Create the final object to add to the scene
    // const curveObject1 = new THREE.Line( geometry1, material1 );

    // scene.add(curveObject1)
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
        for(let i=0;i<lines.length;i++){
            lines[i].rotation.y += 0.006;
        }
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

// // Credit: https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
// function getSplineFromCoords(coords) {
//     const startLat = coords[0];
//     const startLng = coords[1];
//     const endLat = coords[2];
//     const endLng = coords[3];
//     console.log(startLat,startLng);
//     // start and end points
//     const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
//     const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
   
//     // altitude
//     const altitude = clamp(start.distanceTo(end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
    
//     // 2 control points
//     // const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
//     const midCoord1 = start.sub(end).multiplyScalar (0.25);
//     const midCoord2 = end.sub(start).multiplyScalar (0.75);
//     // const midCoord2 = interpolate(0.75);
//     const mid1 = coordinateToPosition(midCoord1.x,midCoord1.y, GLOBE_RADIUS + altitude);
//     const mid2 = coordinateToPosition(midCoord2.x,midCoord2.y, GLOBE_RADIUS + altitude);
   
//     return {
//       start,
//       end,
//       spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end)
//     };
//   }

//   function latLonTo3d(lat,lon,alt){
//     let rad = 3;//     
//     let x = rad* Math.cos(lat) * Math.sin(lon);
//     let y = rad* Math.sin(lat) * Math.sin(lon);
//     let z = rad* Math.cos(lon);
//     return 
//   }
//  function coordinateToPosition(lat, lng, radius) {
//     const phi = (90 - lat) * DEGREE_TO_RADIAN;
//     const theta = (lng + 180) * DEGREE_TO_RADIAN;
  
//     return new THREE.Vector3(
//       - radius * Math.sin(phi) * Math.cos(theta),
//       radius * Math.cos(phi),
//       radius * Math.sin(phi) * Math.sin(theta)
//     );
//   }
//   function clamp(num, min, max) {
//     return num <= min ? min : (num >= max ? max : num);
//   }

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
    let x = Math.cos(lat) * Math.cos(lon) * alt
    let y = Math.cos(lat) * Math.sin(lon) * alt
    let z = Math.sin(lat) * alt // z is 'up'
    return new THREE.Vector3(x,y,z);
}