
let img;
let clouds;
let bg;
let glow;
let sat;
// let defaultFont;
let stars = [];
function setup() {

    createCanvas(innerWidth, innerHeight, WEBGL);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
    background(0);
    sat = new Satellite(0, 250, 5);
    let camera = p5.Camera;
    for (let i = 0; i < random(100, 150); i++) {
        stars.push([createVector(random(-innerWidth, innerWidth), random(-innerHeight, innerHeight), -400), random(0.5, 2)]);
    }
}
// start loading images
function preload() {
    img = loadImage('assets/img/earth.diffuse.2k.jpg');
    clouds = loadImage('assets/img/earth.cloud-transparent.2k.jpg');
    glow = loadImage('assets/img/glow.png');
}
function draw() {
    noCursor();
    background(5, 15, 30, 210);
    if (!img || !clouds) {
        return;
    }
  
    for (let i = 0; i < stars.length; i++) {
        push();
        if (deltaTime % 3 == 0) {
            fill(random(255, sin(deltaTime)));
        }
        else if (deltaTime % 100 == 0) {
            fill(100,100, (100+random(255, sin(deltaTime)))%255);
        }
        else {
            fill(170, 170, 255)
        }
        translate(stars[i][0]);
        circle(0, 0, stars[i][1]);
        pop();
    }

    // allow user to drag, zoom, and move globe
    //orbitControl();
    texture(glow);
    noStroke();
    ellipse(0, 0, 260, 260);

    directionalLight(255, 255, 255, -100, 45, -1);
    push();
    // earth Tilt
    // rotateX(13);
    //earth's rotation
    rotateY(millis() / 10000);


    //earth

    // earth image
    noStroke();
    texture(img);
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
    // stroke(255, 50);
    // circle(0, 0, 250);
    // push();
    // rotateZ(45 - millis() / 1000);
    // let _x = 125;
    // let _y = 0;
    // translate(_x, _y);
    // sphere(3);
    // let eV = createVector(_x + Math.cos(135) * 5, _y + Math.sin(135) * 5).normalize();
    // fill(255);
    // line(0, 0, eV.x * 10, eV.y * 10);
    // pop();
    sat.draw();
    sat.gravity([createVector(0, 0)])
}
class Satellite {
    constructor(x, y, radius = 3, mass = 1) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.radius = radius;
        this.moveVelocity = -1;
        this.acceleration = createVector(-0.7, 0);
        this.velocity = createVector();
    }
    draw() {
        push();
        noStroke();
        fill(100, 100, 100);
        specularMaterial(100, 100, 100);
        translate(this.x, this.y);
        sphere(this.radius);
        pop();

    }
    gravity(listOfObject = []) {
        for (let obj of listOfObject) {

            /* Gravitational force */
            let G = 1;
            let M = 180;
            var d = dist(this.x, this.y, obj.x, obj.y)
            let gravity_force = ((G * this.mass * M) / (sq(d)));
            let gravity_force_x = 0;
            let gravity_force_y = 0;
            if (obj.x != this.x) {
                alpha = atan(abs((obj.y - this.y)) / abs((obj.x - this.x)));
                gravity_force_x = gravity_force * cos(alpha);
                gravity_force_y = gravity_force * sin(alpha);
            } else {
                gravity_force_x = 0;
                gravity_force_y = gravity_force;
            }
            let dir = p5.Vector.sub(obj, createVector(this.x, this.y)).normalize();
            let force = createVector(dir.x * gravity_force_x, dir.y * gravity_force_y);
            this.acceleration.add(force);
            this.velocity.add(this.acceleration);
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.acceleration.mult(0);
        }
    }
}