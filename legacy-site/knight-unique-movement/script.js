
var width = window.innerWidth;
var height = window.innerHeight;
var knightImage;
const PADDING = 2;
const CELLSIZE = 100;
var inputValue;
var resultEle;
/* Simulation variables */
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
    resultEle.innerText=`${moves.length} ♞ moves!`;
    moves.forEach(move => {
        let button = document.createElement('button');
        button.innerText = move;
        button.dataset['value'] = move;
        button.style.minWidth = '10em';
        button.addEventListener('click', e => {
            document.querySelector('#currentMovement').innerText=e.target.innerText;
            board.setAllCellsUnvisited();
            paths = [];
            let intr = button.dataset['interval'];
            clearInterval(intr);
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
                button.dataset['interval'] = tout;
            }
        });
        listOfMovesELe.appendChild(button)
    });

}
function resetUI(){    
    document.querySelector('#currentMovement').innerText='';
}
(function () {
    setTimeout(console.log.bind(console,"%cCode is available at https://downgit.github.io/#/home?url=https://github.com/zeeshananjumjunaidi/zeeshananjumjunaidi/tree/master/knight-unique-movement",'font-size:13px; background:#a70; color:black;'))
    inputValue = document.querySelector('#inputValue');
    const incrementBtn = document.querySelector('#incrementBtn');
    const decrementBtn = document.querySelector('#decrementBtn');
    resultEle = document.querySelector('#result');
    const solveBtn = document.querySelector('#solveBtn');
    
    window.addEventListener('resize',(e)=>{ setup();});

    incrementBtn.addEventListener('click', (e) => {
        inputValue.value = +inputValue.value + 1;
    });
    
    decrementBtn.addEventListener('click', (e) => {
        inputValue.value = +inputValue.value - 1;
        if (+inputValue.value <= 0) {
            inputValue.value = 1;
        }
    });

    solveBtn.addEventListener('click',()=>{ 
        resetUI();
        solveKnightProblem()});

    document.querySelector('#rules').addEventListener('click', function (e) {
        if (e.target.classList.contains('model'))
            hide();
    });
})();
