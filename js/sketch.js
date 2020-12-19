
let img;
let clouds;
let bg;
// let defaultFont;
function setup() {
    
    createCanvas(innerWidth, innerHeight, WEBGL);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
    background(0);
}
// start loading images
function preload() {
    img = loadImage('assets/img/earth.diffuse.2k.jpg');
    clouds = loadImage('assets/img/earth.cloud-transparent.2k.jpg');
    bg = loadImage('assets/img/stars.jpg');
   // defaultFont = loadFont('assets/fonts/SourceSansPro-Regular.otf');
}
function draw() {
    noCursor();
    background(15, 20, 20,50);
    
    
    directionalLight(255, 255, 255, -100,45, -1);
    
    // earth image
    noStroke();
    texture(img);

    // allow user to drag, zoom, and move globe
    orbitControl();
    push();
    // earth Tilt
    rotateX(23.5);
    //earth's rotation
    rotateY(millis() / 10000);
    //earth
    sphere(100);
    specularMaterial(210);
    tint(255, 50);
    texture(clouds);
    sphere(110);
    pop();

    // textFont(defaultFont);
    // textSize(24);
    // let txt = "Earth";
    // let txtWidth = textWidth(txt);
    // text('Earth', 150, 50);
    noFill();
    stroke(255,50);
    circle(0,0,250);
    rotateZ(45-millis() / 1000);
    push();
    let _x = 125;
    let _y = 0;
    translate(_x,_y);
    sphere(3);
    let eV = createVector(_x+Math.cos(135)*5,_y+Math.sin(135)*5).normalize();
    fill(255);
    line(0,0,eV.x*10,eV.y*10);
    pop();
}