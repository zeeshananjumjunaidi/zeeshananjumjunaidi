
var width = window.innerWidth;
var height = window.innerHeight;
var knightImage;
const PADDING = 5;
const CELLSIZE = 100;

/* Simulation variables */
var board;
var knight;

function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    rectMode(CENTER);
    imageMode(CENTER);
    initSimulation();
}
function preload() {
    knightImage = loadImage('./chess-knight.png');
}
function initSimulation() {
    board = new Board([
        ['A', 'B', 'C', ' ', 'E'],
        [' ', 'G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N', 'O'],
        ['P', 'Q', 'R', 'S', 'T'],
        ['U', 'V', ' ', ' ', 'Y'],
    ], CELLSIZE, PADDING);
    knightImage.resize(CELLSIZE, CELLSIZE);
    knight = new Knight(0, 0, board, knightImage, CELLSIZE, PADDING);
}
function draw() {
    background(200, 200, 150);
    translate(CELLSIZE / 2, CELLSIZE / 2);
    board.draw();
    knight.draw();
}
function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        knight.move(-1, 0);
    } else if (keyCode === UP_ARROW) {
        knight.move(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        knight.move(0, 1);
    }
    else if (keyCode === RIGHT_ARROW) {
        knight.move(1, 0);
    }
    // return false;
}
function keyTyped() {
    if (key === 'a') {
        knight.move(-1, 0);
    } else if (key === 'w') {
        knight.move(0, -1);
    } else if (key === 's') {
        knight.move(0, 1);
    }
    else if (key === 'd') {
        knight.move(1, 0);
    } else if (key === 'r') {
        location.reload();
    }
    return false;
}