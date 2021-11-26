


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