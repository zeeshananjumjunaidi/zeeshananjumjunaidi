
var vehicle;
function setup(){ 
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
}


function draw(){
    translate(width / 2, height / 2);
    background(0xEEE);    
    color(0x333);
    vehicle.draw();
    inputController();
    drawLandmark();
    drawDebugInfo();
}
function drawDebugInfo(){
    noFill();
    stroke(1);
    circle(vehicle.position.x,vehicle.position.y,500);
}
function drawLandmark(){
    noFill();
    rect(0,0,100,100,10);

    for(let i=-5;i<5;i++){
        noFill();
    rect(i*100,-250,30,30,3);    
    fill(0);
    text(i+1,i*100,-250);    
    noFill();
    rect(i*100,250,30,30,3);
    fill(0);
    text(i+1,i*100,250);    
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