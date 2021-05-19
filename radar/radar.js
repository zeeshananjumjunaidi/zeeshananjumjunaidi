

var width = 1;
var height = 1;
var mainColor;
var radar = {
    angle: 0,
    range: 300
}
var buildings = new Set();
var targets = [];
var detector;
function setup() {
    imageMode(CENTER);
    textAlign(CENTER);
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    mainColor = color(40, 250, 10);
    sector_radius = width * 0.1;
    for (let i = 0; i < 15; i++) {
        targets.push(new Target(i, random() * width, random() * height, random() * (Math.PI * 2), random() + 0.1, 2000 + random() * 10000));
    }
    detector = new Detector(this.targets, 10);
    for (let i = 0; i < width; i += 20) {
        for (let j = 0; j < height; j += 20) {
            let _x = i;// ((Math.floor(random()*20)/20)%20)*width;
            let _y = j;// ((Math.floor(random()*20)/20)%20)*height;
            if (random() > 0.95) {
                buildings.add([_x, _y]);
            }
        }
    }
}

function draw() {
    background(30);
    noFill();
    drawGrid();
    showBuildings();
    stroke(mainColor);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);
    push();
    translate(width / 2, height / 2);
    drawBackground();
    drawScanner();
    pop();
    drawTargets();
    drawDetection();
    if (radar.angle > 2 * Math.PI) { radar.angle = 0; } else { radar.angle += 0.001 * deltaTime; }
    clicked = false;
}
function drawGrid() {
    stroke(40, 250, 10, 80);
    noFill();
    for (let i = 0; i < width; i += 20) {
        line(0, i, width, i);
    }
    for (let j = 0; j < width; j += 20) {
        line(j, 0, j, width);
    }
}
function showBuildings() {
    fill(40, 250, 10, 80);
    buildings.forEach(function callbackFn(value) {
        rect(value[0], value[1], 20, 20);
    });
    noFill();
}
function drawDetection() {
    noStroke();
    fill(50, 0, 255, 100);

    stroke(255)
    detector.detect();
}
function drawTargets() {
    noStroke();
    fill(255, 0, 0, 150);
    if (clicked) {
        for (let i = 0; i < targets.length; i++) {
            targets[i].selected = false;
        }
    }
    for (let i = 0; i < targets.length; i++) {
        targets[i].draw();
        if (clicked) {
            if (abs(mouseX - targets[i].x) < targets[i].size * 2 && abs(mouseY - targets[i].y) < targets[i].size * 2) {
                targets[i].selected = true;
            }
        }
        targets[i].hover = (abs(mouseX - targets[i].x) < 20 && abs(mouseY - targets[i].y) < 20);

    }
}
clicked = false;
function mouseClicked() {
    clicked = true;
    console.log("mouseClicked");
}
function drawScanner() {

    for (let i = 0; i < Math.PI * 2; i += 0.1) {
        // stroke(40, 250, 10, 50);
        // line(0, 0, Math.cos(i) * radar.range, Math.sin(i) * radar.range);

        fill(40, 250, 10, 150);
        noStroke();
        text(i.toFixed(2), Math.cos(i) * radar.range, Math.sin(i) * radar.range);
    }
    stroke(40, 250, 10, 120);
    for (let i = 0; i < 150; i++) {
        stroke(40, 250, 10, i);
        let dist = i * 0.01;
        line(0, 0, Math.cos(radar.angle + dist) * radar.range, Math.sin(radar.angle + dist) * radar.range);
    }


}

function drawBackground() {
    circle(0, 0, radar.range * 0.5);
    circle(0, 0, radar.range);
    circle(0, 0, radar.range * 1.5);
    circle(0, 0, radar.range * 2);
}