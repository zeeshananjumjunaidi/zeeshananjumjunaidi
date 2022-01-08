
var width = window.innerWidth;
var height = window.innerHeight;
var knightImage;
const PADDING = 2;
const CELLSIZE = 100;
var inputValue;
var resultEle;
/* Simulation variables */
const VOWELS = ['A', 'E', 'I', 'O', 'U'];
var board;
var knight;
var paths = [];

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
        ['A', ' ', 'K', 'P', 'U'],
        ['B', 'G', 'L', 'Q', 'V'],
        ['C', 'H', 'M', 'R', ' '],
        [' ', 'I', 'N', 'S', ' '],
        ['E', 'J', 'O', 'T', 'Y'],

    ], CELLSIZE, PADDING);
    knightImage.resize(CELLSIZE, CELLSIZE);
    knight = new Knight(board, knightImage, CELLSIZE, PADDING);

    // solveKnightProblem();
}
function draw() {
    background(200, 200, 150);
    background('#e3b708');
    translate(CELLSIZE / 2, CELLSIZE / 2);
    board.draw();
    knight.draw();
    if (paths.length > 0) {
        push();
        stroke(20);
        strokeWeight(4)
        var currentPath = paths[0];
        for (let i = 1; i < paths.length; i++) {
            const newPath = paths[i];
            const d0x = currentPath.x * CELLSIZE + PADDING;
            const d0y = currentPath.y * CELLSIZE + PADDING;
            const d1x = newPath.x * CELLSIZE + PADDING;
            const d1y = newPath.y * CELLSIZE + PADDING;
            line(d0x, d0y, d1x, d1y);
            currentPath = newPath;
        }
        pop();
    }
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
    board.setAllCellsUnvisited();
    let dfs = new DFS(board);
    const numberOfSteps = +inputValue.value;
    let moves = dfs.solve(numberOfSteps);
    let listOfMovesELe = document.querySelector('#listOfMoves');
    paths = [];
    listOfMovesELe.replaceChildren();
    moves.forEach(move => {
        let button = document.createElement('button');
        button.innerText = move;
        button.dataset['value'] = move;
        button.style.minWidth = '10em';
        button.style.maxWidth = '10em';
        button.addEventListener('click', e => {
            board.setAllCellsUnvisited();
            let currentStringSequence = e.target.innerText;
            let firstVal = currentStringSequence[0];
            currentStringSequence = currentStringSequence.slice(1);
            let nextcell = board.linearCells.find(x => x.value == firstVal);
            paths.push(nextcell);
            knight.set(nextcell.x, nextcell.y);
            if (currentStringSequence.length > 0) {
                let tout = -1;
                tout = setInterval(() => {
                    firstVal = currentStringSequence[0];
                    currentStringSequence = currentStringSequence.slice(1);
                    nextcell = board.linearCells.find(x => x.value == firstVal);
                    paths.push(nextcell);
                    knight.set(nextcell.x, nextcell.y);
                    if (currentStringSequence.length < 1) { clearInterval(tout) }
                }, 1000);
            }
        });
        listOfMovesELe.appendChild(button)
    });
    // let n = +inputValue.value;
    // let answer = 0;
    // if (n == 1) { // Base case
    //     answer = (5 * 5) - 4; // as the board size is 5x5 and 4 cells are empty.
    // } else if (n > 1) {
    //     // we are using n - 1 because we already occupied the initial position.
    //     knight.travel(n - 1);
    // }
    // let message = `Answer Knight(♞) (${answer})`;
    // resultEle.innerText = message;
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
    // let alternate = false;
    // setInterval(() => {
    //     if (alternate) {
    //         document.title = 'Knight'
    //         alternate = false;
    //     } else {
    //         document.title = '♞';
    //         alternate = true;
    //     }
    // }, 1000);
})();