



var width = 10;
var height = 10;

var vehicle;
var leftVehicle, rightVehicle;
var parking;
function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    rectMode(CENTER);
    imageMode(CENTER);
    init();
}
function init() {
    vehicle = new Vehicle(width / 2 - 100, height / 2 - 100, 0, 0, 0, 0);

    leftVehicle = new Vehicle(width / 2 - 100, height / 2, 0, 0, 0, 0);
    rightVehicle = new Vehicle(width / 2 + 100, height / 2, 0, 0, 0, 0);

    parking = new Parking(leftVehicle, rightVehicle, undefined, vehicle);
}


function draw() {
    background(200);
    parking.draw();
    if (vehicle) {
        vehicle.draw();
        leftVehicle.draw();
        rightVehicle.draw();
        inputController();
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