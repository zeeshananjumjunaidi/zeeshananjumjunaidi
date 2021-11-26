


function createCircle() {
    var radius = 1,
        segments = 64,
        material = new THREE.LineBasicMaterial({ color: 0x0000ff }),
        geometry = new THREE.CircleGeometry(radius, segments);

    // Remove center vertex
    geometry.vertices.shift();
    
    // Non closed circle with one open segment:
    // scene.add(new THREE.Line(geometry, material));

    // To get a closed circle use LineLoop instead (see also @jackrugile his comment):
    return new THREE.LineLoop(geometry, material);
}