


function createCircle() {
    var radius = 1,
        segments = 64,
        material = new THREE.LineBasicMaterial({ color: 0xffffff }),
        geometry = new THREE.CircleGeometry(radius, segments);

    // Remove center vertex
    geometry.vertices.shift();

    // Non closed circle with one open segment:
    // scene.add(new THREE.Line(geometry, material));
    return new THREE.LineLoop(geometry, material);
}
function createTarget() {
    var radius = 2,
        segments = 64,
        material = new THREE.LineBasicMaterial({ color: 0xffffff }),
        geometry = new THREE.CircleGeometry(radius, segments);
    geometry.vertices.shift();

    let group = new THREE.Group();
    let circle = new THREE.LineLoop(geometry, material);
    group.add(circle);

    let circle1 = new THREE.LineLoop(geometry, material);
    circle1.scale.set(0.3, 0.3, 0.3);
    circle1.position.x = 5;
    circle1.position.z = 2;
    circle1.position.y = 3.5;
    group.add(circle1);

    let circle2 = new THREE.LineLoop(geometry, material);
    circle2.scale.set(0.3, 0.3, 0.3);
    circle2.position.x = -3.5;
    circle2.position.z = 2;
    circle2.position.y = 3.5;
    group.add(circle2);

    circle2 = new THREE.LineLoop(geometry, material);
    circle2.scale.set(0.3, 0.3, 0.3);
    circle2.position.x = -3.5;
    circle2.position.z = 2;
    circle2.position.y = -3.5;
    group.add(circle2);

    circle2 = new THREE.LineLoop(geometry, material);
    circle2.scale.set(0.3, 0.3, 0.3);
    circle2.position.x = 5;
    circle2.position.z = 2;
    circle2.position.y = -3.5;
    group.add(circle2);

    // const points = [];
    // // points.push(new THREE.Vector3(- 10, 0, 0));
    // points.push(new THREE.Vector3(9, 1, 0));
    // points.push(new THREE.Vector3(10, 0, 0));
    // points.push(new THREE.Vector3(9, -1, 0));
    // const lineGeom = new THREE.BufferGeometry().setFromPoints( points );
    // const line = new THREE.Line( lineGeom, material );
    // const line2 = new THREE.Line( lineGeom, material );
    // line.rotation.x=Math.PI/2;
    // group.add(line);
    // group.add(line2);
    return group;
}

function createCube(mtl = undefined) {
    // create the Cube
    cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), mtl ? mtl : new THREE.MeshNormalMaterial());
    // cube.position.y = 150;
    return cube;
}