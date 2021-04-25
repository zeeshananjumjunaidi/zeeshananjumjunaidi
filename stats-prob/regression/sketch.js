

const width = window.innerWidth;
const height = window.innerHeight;
let data = [];

let width2 = width / 2;
function setup() {
    createCanvas(width, height);
    imageMode(CENTER);
    rectMode(CENTER);
    console.log("Regression");
}
function draw() {
    background(255);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);
    translate(width / 2, height / 2);
}
