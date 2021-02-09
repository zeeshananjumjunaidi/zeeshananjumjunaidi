class Boid {

    constructor(x, y, z,size=500, id=-1) {
        this.size = size;
        this.id = id ? id : 1;
        this.x = x;
        this.y = y;
        this.z = z;
        this.position=new THREE.Vector3(x,y,z);
    }
    addToScene(scene) {
        const geometry = new THREE.SphereGeometry(this.size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0f00 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.position.x,this.position.y,this.position.z);
        scene.add(sphere);
        this.position = sphere.position;
    }
}