
function createRect(x,y,w,h,clr=0xff0000) {

    const material = new THREE.LineBasicMaterial({
        color: clr
    });

    const points = [];
    points.push(new THREE.Vector3(x, 0, y));
    points.push(new THREE.Vector3(x, 0, y+h));
    points.push(new THREE.Vector3(x+w, 0, y+h));
    points.push(new THREE.Vector3(x+w, 0, y));
    points.push(new THREE.Vector3(x, 0, y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.translate(0, 0, 2000);
    const line = new THREE.Line(geometry, material);
    line.position.y = 100;
    return line;
}
function createPlane(x,y,z,w,h,clr=0xff0000){
    const geometry = new THREE.PlaneGeometry( w, h, 1,1 );
    const material = new THREE.MeshBasicMaterial( {color: clr, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(x+500,y,z+2500);
    plane.rotateX(Math.PI/2);
    return plane;
}