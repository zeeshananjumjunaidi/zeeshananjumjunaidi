
var vehicle;
var landmarkOrigins = [];

var GPS_estimate = new p5.Vector();
var GPS_INTERVAL = 1000;
function setup() {
    canvasWidth = round(window.innerWidth);
    canvasHeight = round(window.innerHeight);
    createCanvas(canvasWidth, canvasHeight);
    canvasHalfHeight = canvasHeight / 2;
    canvasHalfWidth = canvasWidth / 2;
    rectMode(CENTER);
    imageMode(CENTER);
    // angleMode(DEGREES);
    frameRate(100);
    textSize(9);
    vehicle = new Vehicle(250, 0, 0);

    for (let i = -5; i < 5; i++) {
        landmarkOrigins.push([i * 100, -250]);
        landmarkOrigins.push([i * 100, 250]);
    }
    setInterval(() => {
        GPS_estimate = new p5.Vector(vehicle.position.x+Math.random(-30,30),vehicle.position.y+Math.random(-30,30),
        vehicle.heading+Math.random(-0.2,0.2));
        print(GPS_estimate);
    }, GPS_INTERVAL);
}


function draw() {
    translate(width / 2, height / 2);
    background(0xEEE);
    color(0x333);
    vehicle.draw();
    inputController();
    drawLandmark();
    drawDebugInfo();
    update();
}
let angle=0;
function drawDebugInfo() {
    noFill();
    stroke(1,50);
    let scannerRadius = 700;
    circle(vehicle.position.x, vehicle.position.y, scannerRadius);

    angle += 0.02;
    circle(vehicle.position.x, vehicle.position.y, Math.sin(angle)*scannerRadius);

    for(let i=0;i<landmarkOrigins.length;i++){
        if(dist(landmarkOrigins[i][0],landmarkOrigins[i][1],this.vehicle.position.x,this.vehicle.position.y)<scannerRadius/2){
            line(landmarkOrigins[i][0],landmarkOrigins[i][1],this.vehicle.position.x,this.vehicle.position.y);
            fill(255,0,0);
            circle(landmarkOrigins[i][0],landmarkOrigins[i][1],10);
        }
    }
}
function update(){
    vehicle.tPosition.x=GPS_estimate.x;
    vehicle.tPosition.y=GPS_estimate.y;
    vehicle.tHeading=GPS_estimate.z;
}
function drawLandmark() {
    noFill();
    stroke(1);
    rect(0, 0, 100, 100, 10);
    for (let i = 0; i < landmarkOrigins.length; i++) {
        let lMark = landmarkOrigins[i];
        noFill();
        rect(lMark[0], lMark[1], 30, 30, 3);
        fill(0);
        text(i + 1, lMark[0], lMark[1]);
    }
}

function inputController() {
    let constantSpeed = 0;
    let constantAngle = 0;
    let targetPosition = createVector();
    if (keyIsDown(65)) {
        constantAngle = -1;
    } else if (keyIsDown(68)) {
        constantAngle = 1;
    } else { constantAngle *= 0.2; }

    if (keyIsDown(87)) {
        constantSpeed += 1;
    } else if (keyIsDown(83)) {
        constantSpeed -= 1;
    } else {
        constantSpeed = 0;
    }
    if (keyIsDown(LEFT_ARROW)) {
        targetPosition.x -= 1;
    }
    else if (keyIsDown(RIGHT_ARROW)) {
        targetPosition.x += 1;
    }
    if (keyIsDown(UP_ARROW)) {
        targetPosition.y -= 1;
    }
    else if (keyIsDown(DOWN_ARROW)) {
        targetPosition.y += 1;
    }

    targetHeading = 0;
    if (keyIsDown(69)) {
        targetHeading += 1;
    }
    else if (keyIsDown(81)) {
        targetHeading -= 1;
    }
    else { }

    vehicle.drive(constantSpeed * 2, constantAngle);
  
    vehicle.updateTargetControl(targetPosition, targetHeading);

    // Mouse Control for moving target
    if (this.targetDragEnabled) {
        let mx = mouseX - width / 2;
        let my = mouseY - height / 2;
        this.vehicle.tPosition.x = mx;
        this.vehicle.tPosition.y = my;
        push();
        stroke(255, 50);
        fill(255, 20);
        translate(mx, my);
        rotate(this.vehicle.tHeading);
        rect(0, 0, 50, 30, 3);
        pop();
    }
}

targetDragEnabled = false;
function mousePressed() {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    if (mx >= this.vehicle.tPosition.x - 25 && mx <= this.vehicle.tPosition.x + 25
        &&
        my >= this.vehicle.tPosition.y - 10 && my <= this.vehicle.tPosition.y + 10) {
        this.targetDragEnabled = true;
    }
}
function mouseReleased() {
    // print('release');
    this.targetDragEnabled = false;
}