
openSet = [];
closeSet = [];
isFinished = false;
maxHs = 0;
maxWs = 0;
goal = undefined;
_40_deg = 0.698132;
path = [];
var vehicle;
function setup() {

    vehicle = new Vehicle(200, 0, 0);
    frameRate(1005);
    cellSize = 30;
    scaleSize = 30;
    createCanvas(cellSize * scaleSize, cellSize * scaleSize);
    centerOffset = cellSize / 2;
    rectMode(CENTER);
    imageMode(CENTER);
    // startWidth = -width / 2;
    // startHeight = -height / 2;
    textAlign(CENTER);
    textSize(9);
    grid = [];
    maxWs = Math.floor(width / cellSize);
    maxHs = Math.floor(height / cellSize);
    createGrid();
}
function createGrid() {
    openSet = [];
    closeSet = [];
    isFinished = false;
    let indexI = 0;
    id = 0;
    for (let i = 0; i < maxWs; i += 1) {
        let indexJ = 0;
        grid.push([]);
        for (let j = 0; j < maxHs; j += 1) {
            let isBlocked = false;//Math.random() > 0.96;
            grid[i].push(new Cell(id++, i, j, 0, isBlocked, undefined, false, cellSize));
            indexJ++;
        } indexI++;
    }
    for (let i = 0; i < 5; i++) {
        this.grid[10][i].isBlocked = true;
        this.grid[i][10].isBlocked = true;
    }
    for (let i = 1; i < 5; i++) {
        this.grid[15][i].isBlocked = true;
        this.grid[i][15].isBlocked = true;
    }
    for (let i = maxWs - 10; i < maxWs; i++) {
        this.grid[i][Math.ceil(maxWs * 0.7)].isBlocked = true;
        // this.grid[i][15].isBlocked = true;
    }
    for (let i = maxWs - 3; i < maxWs; i++) {
        this.grid[Math.ceil(maxWs * 0.8)][i].isBlocked = true;
        this.grid[i][Math.ceil(maxWs * 0.5)].isBlocked = true;
        // this.grid[i][15].isBlocked = true;
    }
    for (let i = 10; i < 15; i++) {
        this.grid[i][4].isBlocked = true;
        this.grid[i][10].isBlocked = true;
        this.grid[12][i].isBlocked = true;
    }
    // for (let j = 0; j < maxHs / 5; j += 1) {
    //     this.grid[6][j].isBlocked = true;
    // }
    resetMap();

}
currentCell = undefined;
function resetMap() {
    openSet = [];
    closeSet = [];
    isFinished = false;
    for (let i = 0; i < maxWs; i += 1) {
        for (let j = 0; j < maxHs; j += 1) {
            this.grid[i][j].isVisited = false;
        }
    }
    
    curIx=7;
    curIy=8;
    grid[curIx][curIy].isBlocked = false;
    grid[curIx][curIy].isStart = true;
    grid[curIx][curIy].heading = 0;
    currentCell = this.grid[curIx][curIy];

    vehicle.heading = grid[curIx][curIy].heading;

    vehicle.position.x = grid[curIx][curIy].x * cellSize+ cellSize/2;
    vehicle.position.y = grid[curIx][curIy].y * cellSize+ cellSize/2;
    // vehicle.tPosition.x = grid[curIx][curIy].x * cellSize+ cellSize/2;
    // vehicle.tPosition.y = grid[curIx][curIy].y * cellSize+ cellSize/2;

    // grid[3][8].selectedHeading = Math.PI;
    openSet.push(grid[curIx][curIy]);
   
    path = [];
}


function draw() {
    background(30);

    for (let i = 0; i < maxWs; i += 1) {
        for (let j = 0; j < maxHs; j += 1) {
            let c = grid[i][j];
            c.show();
        }
    }
    for (let i = 0; i < maxWs; i += 1) {
        for (let j = 0; j < maxHs; j += 1) {
            let c = grid[i][j];
            c.showMovements();
        }
    }
    // Hybrid A* Computation
    while (!isFinished && openSet.length > 0 && goal) {
        // Get the closest cell as current cell
        lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];
        current.isVisited = true;
        openSet.splice(lowestIndex, 1);
        // put in push set
        closeSet.push(current);
        // print(current, goal);
        if (isGoalReached(current, goal)) {// current.isGoal) {
            isFinished = true;
            print('Goal Found');
            let c = current;
            while (c) {
                c.isPath = true;

                path.push(c);
                let p = c.parent;
                if (p) {
                    //c.heading = Math.atan2(p.pY - c.pY, p.pX - c.pX);
                }
                c = p;
            }
            //Trigger reconstruct path
        }
        let neighbors = getHybridNeighbor(current);
        for (let i = 0; i < neighbors.length; i++) {
            let n = neighbors[i];
            if (n.isBlocked || n.isVisited) continue;
            if (!closeSet.includes(n)) {
                let tentative_gScore = current.g + Math.abs(Math.abs(current.heading) - Math.abs(n.heading));
                // _40_deg RAD to ~40DEG
                // if (current.heading + _40_deg < n.heading && current.heading - _40_deg > n.heading) {
                if (current.heading >= Math.PI || current.heading <= -Math.PI) {
                    tentative_gScore += 1;// large penalty for reversing
                }
                if (openSet.includes(n)) {
                    if (tentative_gScore < n.g) {
                        n.g = tentative_gScore;
                        n.isVisited = true;
                    }
                } else {
                    n.g = tentative_gScore;
                    n.h = dist(n.x, n.y, goal.x, goal.y);
                    n.f = n.g + n.h +n.angleCost*5;//+Math.abs(current.heading) - Math.abs(n.heading);
                    openSet.push(n);
                    n.isVisited = true;
                }
                n.h = getDistance(n, goal);
                n.f = n.g + n.h;
                n.parent = current;
            }
        }
    }

    manualDrive();
    autoDrive();
    
    vehicle.draw();


}
currentIndex = 0;

function manualDrive(){
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
        targetHeading += 0.5;
    }
    else if (keyIsDown(81)) {
        targetHeading -= 0.5;
    }
    else { }    

    vehicle.drive(constantSpeed * 2, constantAngle);
    vehicle.updateTargetControl(targetPosition, targetHeading);
}
function autoDrive() {
   // vehicle.drive(1, 1); circle(vehicle.position.x, vehicle.position.y,20);
    let d =0;
    if (currentCell) {
       // vehicle.drive(1,Math.round (currentCell.heading - vehicle.heading)); 
         d = dist(currentCell.pX, currentCell.pY,
            vehicle.position.x, vehicle.position.y) ;      
    }
    if (d<25&&currentCell) {fill(255,0,0);
        print(d,currentIndex);
        print(path);
        currentIndex++;
        currentCell = path[path.length-currentIndex];
        if(currentCell){
        currentCell.value=2;
        print(currentCell);
        circle(currentCell.pX, currentCell.pY,20);}
    }
}
function equationSolve(x, coeff) {
    return coeff[0] * (x * x * x) + coeff[1] * (x * x) + coeff[2] * x + coeff[3] + coeff[4] * Math.sin(x);
}



function getDistance(a, b) {
    return dist(a.x, a.y, b.x, b.y);
}
/**
 * Tradiional A* get neighbors
 * @param {*} cell 
 */
function getNeighbors(cell) {
    let neighbors = [];
    for (n of [[-1, -1], [1, 1], [-1, 1], [1, -1], [0, -1], [-1, 0], [1, 0], [0, 1]]) {
        if (isValidCell([cell.x + n[0], cell.y + n[1]])) {
            neighbors.push(grid[cell.x + n[0]][cell.y + n[1]]);
        }
    }
    return neighbors;
}
/**
 * Check if cell is valid or not
 * @param {number array with 2 values} n 
 */
function isValidCell(n) {
    return (n[0] >= 0 && n[1] >= 0 && n[0] < maxWs && n[1] < maxHs);
}

function mousePressed(e) {
    e.preventDefault();
    let x = Math.floor(mouseX / cellSize);
    let y = Math.floor(mouseY / cellSize);
    if (isValidCell([x, y])) {
        setGoal(x, y);
        resetMap();
    }
}

function setGoal(x, y) {
    for (let i = 0; i < maxWs; i += 1) {
        for (let j = 0; j < maxHs; j += 1) {
            this.grid[i][j].isGoal = false;
            this.grid[i][j].isPath = false;
            this.grid[i][j].parent = undefined;
        }
    }
    goal = this.grid[x][y];
    goal.heading = 0;
    // goal.heading = -Math.PI / 2;
    goal.isGoal = true;
    
    vehicle.tPosition.x = goal.x * cellSize+ cellSize/2;
    vehicle.tPosition.y = goal.y * cellSize+ cellSize/2;
    vehicle.tHeading = goal.heading;
}
function isGoalReached(cell, goal) {
    // if ((cell.heading > goal.heading - _40_deg && cell.heading < goal.heading + _40_deg)
    // || (cell.heading > goal.heading + (3 / 4 * Math.PI) &&
    //     (cell.heading < goal.heading + (4 / 3 * Math.PI)))) {
        let listOfAngles = [
            0,
            0.610865,//35
            -0.610865,//-35
            3.14159,//180
            3.75246,//215
            -3.75246,//145
        ];    let listOfCost = [
            0,
            0.05,
            0.6,
            0.05,
            0.6,
            0,
        ];
    if (goal == cell) { return true; }
    for (let i = 0; i < listOfAngles.length; i++) {
        let radAngle = cell.heading + (listOfAngles[i]);
        // cell.angleCost=listOfCost[i];
        let nx = cell.x + Math.cos(radAngle) * cell.cellSize;
        let ny = cell.y + Math.sin(radAngle) * cell.cellSize;

        if (dist(goal.pX, goal.pY, nx, ny) < 100) {
            // if (cell.heading == goal.heading && dist(cell.pX, cell.pY, goal.pX, goal.pY) < 2) {
            print(cell.x, cell.y);
            print(cell, goal);
            return true;
            //  }
        }
    }
    return false;
}
function getHybridNeighbor(cell) {
    stroke(100, 100, 0);
    fill(0, 200, 0);
    
    let lengthOfPoint=cell.cellSize;
    lengthOfPoint=10;

    
    // here we can take goal as function parameter
    let radAngleP = goal.heading + Math.PI / 2;// +90 is not possible, this could be config parameter
    let radAngleN = goal.heading - Math.PI / 2;// -90 is not possible, this could be config parameter
    let radAngleB = goal.heading + Math.PI;// -90 is not possible, this could be config parameter
    let gPx = goal.pX + Math.cos(radAngleP) * lengthOfPoint;
    let gPy = goal.pY + Math.sin(radAngleP) * lengthOfPoint;
    let gNx = goal.pX + Math.cos(radAngleN) * lengthOfPoint;
    let gNy = goal.pY + Math.sin(radAngleN) * lengthOfPoint;

    let gBx = goal.pX + Math.cos(radAngleB) * lengthOfPoint;
    let gBy = goal.pY + Math.sin(radAngleB) * lengthOfPoint;
    let gCx = goal.x + Math.floor(roundX(lengthOfPoint, gBx) / lengthOfPoint);
    let gCy = goal.y + Math.floor(roundX(lengthOfPoint, gBy) / lengthOfPoint);

    let possiblePoints = [];

    let listOfAngles = [
        0,
        0.610865,//35
         -0.610865,//-35 hn
         3.14159,//180
          3.75246,//215
          -3.75246,//145
    ]; 
    let listOfCost = [
        0,
        0.05,
        0.05,        
       123212130.1,
        0.2,
        0.2,
    ];
    for (let i = 0; i < listOfAngles.length; i++) {
        let radAngle = cell.heading + (listOfAngles[i]);
        let nx = Math.cos(radAngle) * lengthOfPoint;
        let ny = Math.sin(radAngle) * lengthOfPoint;
        if ((nx == gPx && ny == gPy) || (nx == gNx && ny == gNy) || ((cell.pX == gPx && cell.pY == gPy) || (cell.pX == gNx && cell.pY == gNy))) { continue; }
        possiblePoints.push([nx, ny, radAngle,listOfCost[i]]);
    }
    let neighbors = [];
    for (let i = 0; i < possiblePoints.length; i++) {
        let pp = possiblePoints[i];
        let x = cell.x + Math.floor(roundX(lengthOfPoint, pp[0]) / lengthOfPoint);
        let y = cell.y + Math.floor(roundX(lengthOfPoint, pp[1]) / lengthOfPoint);
        if (this.isValidCell([x, y]) && !this.grid[x][y].isVisited) {
            let c = this.grid[x][y];
            c.destPointX=c.pX+pp[0];
            c.destPointY=c.pY+pp[1];
            if (!c.isGoal)
                c.heading = pp[2];
            if (c.x == gCx && c.y == gCy && c.isBlocked) { continue; }
            c.angleCost+=pp[3];
            neighbors.push(c);
        }
    }
    cell.hn = neighbors;
    return neighbors;
}
function roundX(snapValue, input) {
    return snapValue * Math.round((input / snapValue));
}
// Read https://www.ri.cmu.edu/pub_files/pub1/thrun_sebastian_1996_1/thrun_sebastian_1996_1.pdf