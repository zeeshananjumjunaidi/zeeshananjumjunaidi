
/**
 * @author [Zeeshan Anjum Junaidi]
 * @email [zeeshananjumjunaidi@gmail.com]
 * @create date 2020-11-02 05:24:30
 * @modify date 2020-11-28 11:41:19
 */

var vehicle;
var hybridMap;
var canvasWidth = 600;
var canvasHeight = 600;
var canvasHalfWidth = 100;
var canvasHalfHeight = 100;
var showHelp = false;
var toggleWallsButton;
function setup() {
    canvasWidth = round(window.innerWidth);
    canvasHeight = round(window.innerHeight);
    createCanvas(canvasWidth, canvasHeight);
    canvasHalfHeight = canvasHeight / 2;
    canvasHalfWidth = canvasWidth / 2;
    rectMode(CENTER);
    imageMode(CENTER);
    frameRate(100);
    textSize(9);
    vehicle = new Vehicle(250, 0, 0);
    let environment = new Environment();
    vehicle.setEnvironment(environment);
    environment.addWall(-200, -150, -200, 200);


    environment.addWall(200, -100, 200, 100);
    environment.addWall(-width / 2, 200, -200, 200);
    environment.addWall(-width / 2, -150, -width/3, -150);

    environment.addWall(200, -200, width / 2, -200);
    environment.addWall(200, 200, width / 3, 200);


    environment.addWall(200, 150, width / 5, 150);
    environment.addWall(200, 150, 200, 200);


    environment.addWall(-50, -30, 50, -30);
    environment.addWall(-50, 30, 50, 30);

    environment.addWall(-50, -30, -50, 30);

    // Hybrid A* Map
    hybridMap = new HybridAStarMap(width, height, 50);
    hybridMap.setVehicle(vehicle);
    let v = localStorage.getItem('vehicle');
    if (v) {
        jObject = JSON.parse(v);
        if (jObject) {
            vehicle.position.x = jObject.x;
            vehicle.position.y = jObject.y;
            vehicle.tPosition.x = jObject.tx;
            vehicle.tPosition.y = jObject.ty;
            vehicle.heading = jObject.heading;
            vehicle.tHeading = jObject.tHeading;
            print(jObject);
        }
    }
    toggleWallsButton=new Button(100,height/2-20,100,30,"reset",()=>{
        // toggleWallsButton
    });
    vehicle.toggleAlwaysSolve();
}
function draw() {
    translate(width / 2, height / 2);
    background(244);
    color(255);
    drawBackground(canvasHalfWidth, canvasHalfHeight);

    hybridMap.show();

    inputController();
    vehicle.draw();
    // display help info
    noStroke();
    fill(255);
    textSize(12);
    text("press H for help", -40, height / 2 - 30);
    if (this.showHelp) {
        displayHelp();
    }
 //   toggleWallsButton.show();
  //  toggleWallsButton.hover();
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
function mouseDragged() {
    // // print('drag');
    // let mx = mouseX-width/2;
    // let my = mouseY-height/2;
    // if(mx>=this.vehicle.tPosition.x-25 && mx<=this.vehicle.tPosition.x+25
    //     &&
    //     my>=this.vehicle.tPosition.y-25 && my<=this.vehicle.tPosition.y+25 ){
    // }
}
function keyPressed() {
    if (key == 't') {
        print("Toggle debug");
        vehicle.toggleDebug();
    } else if (key == 'h') {
        toggleHelp();
    }else if (key == 'g') {
        hybridMap.solve();
    } else if (key == 'p') {
        vehicle.toggleAutoPilot();
    } else if (key == 'l') {
        vehicle.toggleAlwaysSolve();
    } else if (key == ' ') {
        vehicle.solvePath();
    } else if (key == 'k') {
        console.debug("Saving position");
        localStorage.setItem("vehicle", JSON.stringify({
            'x': vehicle.position.x,
            'y': vehicle.position.y,
            'heading': vehicle.heading,
            'tx': vehicle.tPosition.x,
            'ty': vehicle.tPosition.y,
            'tHeading': vehicle.tHeading
        }
        ));
    }
}

function toggleHelp() {
    this.showHelp = !this.showHelp;
}
function displayHelp() {
    fill(50, 200);
    noStroke();
    rect(0, -40, width / 1.5, 150, 5);
    let words = ['press L to toggle live path solver',
        'Press P to toggle Manual / Auto driver',
        'Click, hold and move on target vehicle to move ',
        'To save current vehicle and target state press k',
        'press Q/E to rotate target vehicle, ⬆⬇⬅➡ arrows to move target vehicle',
        'WASD to drive vehicle in manual mode', 'Press T toggle Debug UI'];
    fill(255);
    textSize(16);
    let word = 'HELP';
    let txtSize = textWidth(word);
    text(word, -txtSize / 2, -95);
    textSize(12);
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let txtSize = textWidth(word);
        text(word, -txtSize / 2, -80 + i * 15);
    }
}

function mouseClicked() {
    toggleWallsButton.pressed();
  }