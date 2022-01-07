
var width = window.innerWidth;
var height = window.innerHeight;
var knightImage;
const PADDING = 5;
const CELLSIZE = 100;
var inputValue;
var resultEle;
/* Simulation variables */
const VOWELS = ['A', 'E', 'I', 'O', 'U'];
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

function toggleRules() {
    document.querySelector('#rules').classList.toggle('hide');
}
function hide() {
    document.querySelector('#rules').classList.add('hide');
}
function reset() {
    location.reload();
}
function solveKnightProblem() {
    let _inputValue = +inputValue.value;
    let answer = 0;
    if (_inputValue == 1) {
        answer = (5 * 5) - 4;
    } else if (_inputValue > 1) {
        // Let us place this knight over 0,0 index, value "A" on board
        
    }
    let message = `Answer Knight(♞) (${answer})`;
    resultEle.innerText = message;
}
(function () {
    inputValue = document.querySelector('#inputValue');
    const incrementBtn = document.querySelector('#incrementBtn');
    const decrementBtn = document.querySelector('#decrementBtn');
    resultEle = document.querySelector('#result');
    const solveBtn = document.querySelector('#solveBtn');
    incrementBtn.addEventListener('click', (e) => {
        inputValue.value = +inputValue.value + 1;
        console.log(inputValue)
    });
    decrementBtn.addEventListener('click', (e) => {
        inputValue.value = +inputValue.value - 1;
        if (+inputValue.value <= 0) {
            inputValue.value = 1;
        }
        console.log(inputValue)
    });
    solveBtn.addEventListener('click', solveKnightProblem);


    document.querySelector('#rules').addEventListener('click', function (e) {
        if (e.target.classList.contains('model'))
            hide();
    });
    let alternate = false;
    setInterval(() => {
        if (alternate) {
            document.title = 'Knight'
            alternate = false;
        } else {
            document.title = '♞';
            alternate = true;
        }
    }, 1000);
})();