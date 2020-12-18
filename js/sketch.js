
let img;

function setup() {
    print(innerWidth, innerHeight);
    createCanvas(innerWidth, innerHeight, WEBGL);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);

}
// start loading images
function preload() {
    // image texture from http://planetpixelemporium.com/
    img = loadImage('assets/img/earth.diffuse.2k.jpg');
}
function draw() {
    noCursor();
    background(15, 20, 20);
    // earth image
    noStroke();
    texture(img);

    // allow user to drag, zoom, and move globe
    orbitControl();

    //earth's rotation
    rotateY(millis() / 10000);
    //earth
    sphere(100);
}