class HybridAStarMap {

    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        // cellSize=30;
        this.cellSize = cellSize;
        this.rows = Math.round(width / cellSize);
        this.cols = Math.round(height / cellSize);
        this.padding = 25;
        print("Initialized Hybrid A*", this);
        this.vehicle = undefined;
        this.grid = [];
        this.generateGrid();
        this.currentCell = undefined;
        this.goalCell = undefined;
        this.isGoalReached = false;
        this.finishedAStarPath=[];
    }
    generateGrid() {
        this.grid = [];
        let a = 0;
        let id = 0;
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            let b = 0;
            for (let j = 0; j < this.cols; j++) {
                let x = -(this.width / 2) + i * this.cellSize;
                let y = -this.height / 2 + j * this.cellSize;
                this.grid[i].push(
                    new Cell(id++, x, y, 0, false, null, false, this.cellSize));
                this.grid[i][j].i = a;
                this.grid[i][j].j = b++;
                this.grid[i][j].pX = x;
                this.grid[i][j].pY = y;
            }
            a++;
        }
        // for (let i = 0; i < this.rows; i++) {
        //     for (let j = 0; j < this.cols; j++) {
        //         this.grid[i][j].neighbours = this.getNeighbourCells(this.grid[i][j]);
        //     }
        // }
        // add some testing obstacles
        this.grid[7][5].isBlocked=true;
        this.grid[7][6].isBlocked=true;
        this.grid[6][7].isBlocked=true;
    }
    setVehicle(vehicle) {
        this.vehicle = vehicle;
    }
    show() {return;
        //Front facing arc for hybrid A* movement
        // this.drawDrivingPathArc(this.vehicle.position,this.vehicle.heading,50);
        textSize(12);
        stroke(100, 20);
        push();
        translate(this.padding, this.padding);
        let prev=undefined;
        let z=0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let c = this.grid[i][j];
                if(c.isBlocked){
                    fill(0);
                }else
                if (c.value == 1) {// current cell
                    fill(0, 255, 0, 120, 60);
                } else if (c.value == 3) {// goal cell
                    fill(255, 0, 0, 120, 60);
                } else if (c.value == 2) { // current neighbour cells
                    fill(220, 0, 220, 50);
                    if(prev){
                        // text(c.heading,c.pX,c.pY);
                        stroke(255);
                        // strokeWeight(3);
                        // circle(c.x,c.y,10);
                        // circle(c.vX,c.vY,10);
                         line(prev.vX,prev.vY,c.vX,c.vY);
                        text(z++,c.vX,c.vY);
                        noStroke();
                    }
                    prev = c;
                } else {
                    fill(255, 20);
                }
                text(`${i},${j}`, c.x, c.y);
                rect(c.x, c.y, this.cellSize, this.cellSize);
            }
        }
        pop();
        // this.updateVehicleCellIndices();
        this.   solve();
    }
    updateVehicleCellIndices() {
        this.updateVehicleGridIndex();
        this.updateVehicleTargetGridIndex();
        this.getNeighbourCellsNearVehicle();
    }
    updateVehicleTargetGridIndex() {
        if (this.goalCell) {
            this.goalCell.value = 0;
        }
        let x = Math.abs(Math.ceil(((-this.width / 2) - this.vehicle.tPosition.x) / this.cellSize));
        let y = Math.abs(Math.ceil(((-this.height / 2) - this.vehicle.tPosition.y) / this.cellSize));
        if (this.isValidCellIndices(x, y)) {
            this.grid[x][y].value = 3;
            // this.updateSafetyCells(x, y);
            this.goalCell = this.grid[x][y];
            this.goalCell.cX=this.vehicle.tPosition.x;
            this.goalCell.cY=this.vehicle.tPosition.y;
            this.goalCell.vX=this.vehicle.tPosition.x;
            this.goalCell.vY=this.vehicle.tPosition.y;
            this.goalCell.heading=this.vehicle.tHeading;
        
        }
    }

    updateVehicleGridIndex() {
        if (this.currentCell) {
            this.currentCell.value = 0;
        }
        let x = Math.abs(Math.ceil(((-this.width / 2) - this.vehicle.position.x) / this.cellSize));
        let y = Math.abs(Math.ceil(((-this.height / 2) - this.vehicle.position.y) / this.cellSize));
        if (this.isValidCellIndices(x, y)) {
            this.grid[x][y].value = 1;
            fill(220)
            text(x + ',' + y, this.vehicle.position.x,
                this.vehicle.position.y - 50);
            this.currentCell = this.grid[x][y];
            this.currentCell.cX=this.vehicle.position.x;
            this.currentCell.cY=this.vehicle.position.y;
            this.currentCell.vX=this.vehicle.position.x;
            this.currentCell.vY=this.vehicle.position.y;
            this.currentCell.heading=this.vehicle.heading;
        }
    }
    getCellIndexByPosition(x, y) {
        let _x = Math.abs(Math.ceil(((-this.width / 2) - x) / this.cellSize));
        let _y = Math.abs(Math.ceil(((-this.height / 2) - y) / this.cellSize));
        if (this.isValidCellIndices(_x, _y)) {
            return this.grid[_x][_y];//{ x: _x, y: _y };
        }
        return null;
    }

    // here it is wrong.
    getNeighbourCellsNearVehicle() {
        let fwdDist = 50;//this.vehicle.turningRadius
        //Front Point
        let pc = createVector();
        pc.x = this.vehicle.position.x + Math.cos(this.vehicle.heading) * fwdDist;
        pc.y = this.vehicle.position.y + Math.sin(this.vehicle.heading) * fwdDist;
        // Left Point
        let lPoint = rotatePoint(pc.x, pc.y, Math.PI / 2, this.vehicle.position);
        // Right Point
        let rPoint = rotatePoint(pc.x, pc.y, -Math.PI / 2, this.vehicle.position);
        fill(255);
        drawCircle(pc, 10);
        drawCircle(lPoint, 10);
        drawCircle(rPoint, 10);
        let fCell = this.getCellIndexByPosition(pc.x, pc.y);
        let rCell = this.getCellIndexByPosition(rPoint.x, rPoint.y);
        let lCell = this.getCellIndexByPosition(lPoint.x, lPoint.y);
        return [fCell, rCell, lCell];

    }
    resetGridMap() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].value = 0;
            }
        }
    }

    isValidCellIndices(x, y) {
        if (x >= 0 && y >= 0 && x <= this.rows - 1 && y <= this.cols - 1) {
            return true;
        }
        return false;
    }

    drawDrivingPathArc(position, heading, turingRadius) {
        stroke(0, 255, 0);
        let x = position.x + Math.cos(heading) * turingRadius;
        let y = position.y + Math.sin(heading) * turingRadius;

        line(position.x, position.y, x, y);
        let l = rotatePoint(x, y, Math.PI / 2, position);
        let r = rotatePoint(x, y, -Math.PI / 2, position);
        drawCircle(l, 10);
        drawCircle(r, 10);
        let arcl = Math.atan2(l.y - position.y, l.x - position.x);
        let arcr = Math.atan2(r.y - position.y, r.x - position.x);

        arc(this.vehicle.vLCircle.x, this.vehicle.vLCircle.y, 100, 100, arcl, arcr);
        arc(this.vehicle.vRCircle.x, this.vehicle.vRCircle.y, 100, 100, arcl, arcr);
    }
    /// A* Algorithm
    /// Converting A* into Hybrid A*
    solve() {     

        this.generateGrid();
        this.updateVehicleCellIndices();
        let start =this.currentCell;// this.grid[0][0];
        let goal = this.goalCell;// this.grid[11][11];
        start.value=1;
        goal.value=3;
       // this.resetGridMap();
        this.isGoalReached = false;
        let openSet = [start];
        let closedSet = [];
        // let x = 0;

        let current = start;
        while (!this.isGoalReached && openSet.length > 0) {
            // if (x < 1000) {
            //     x++;
            // } else { this.isGoalReached = true; }

            openSet.sort((a, b) => { return b.f - a.f });
            openSet.reverse();
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;// this will remove cell from openList and assign to current
                }
            }
            current = openSet[lowestIndex];

            openSet.splice(lowestIndex, 1);
            closedSet.push(current);
            if (current.i == goal.i && current.j == goal.j) {
                // goal found
               // print('Goal Found');
                this.isGoalReached = true;
                current.value = 2;
                this.reconstructPath(current);
                // reconstructPath
            }
            // for (let neighbour of current.neighbours) {
            // Here we will get neighbours based on 
            // our vehicle heading and orientation.
            current.neighbours = this.getHybridAStarNeighbours(current);
            for (let neighbour of current.neighbours) {
                // checking for blocked
                if(neighbour.isBlocked){
                    continue;
                }
                if (!closedSet.includes(neighbour)) {
                    let tentative_gScore = current.g +Math.abs(current.heading)+Math.abs(neighbour.heading);

                    if (openSet.includes(neighbour)) {
                        if (tentative_gScore < neighbour.g) {
                            neighbour.g = tentative_gScore;
                        }
                    } else {
                        neighbour.g = tentative_gScore;
                        openSet.push(neighbour);
                    }
                    neighbour.h = this.getDistance(neighbour,goal);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = current;
                    
                }
            }
        }
        this.goalCell.value=1;
        this.currentCell.value=3;

    }
    reconstructPath(cell){
        this.finishedAStarPath=[];
        let current = cell;
        while(current){
            this.finishedAStarPath.push(current);
            current.value=2;
            current = current.parent;            
        }
    }
    /**
     * get Neighbours of current
     * @param {Cell} cell 
     * @param {string} method hybrid | normal
     */
    getNeighbourCells(cell,method="hybrid") {
        return this.getHybridAStarNeighbours(cell);
        let listOfNeighbours = [];

        for (let pos of [
            [0, -1], [0, 1], // up down
            [-1, 0], [1, 0], // left right
            [-1, -1], [-1, 1], //top left, bottom left
            [1, -1], [1, 1] // bottom right, top right
        ]) 
        {

            let cX = pos[0] + cell.i;
            let cY = pos[1] + cell.j;
            if (this.isValidCellIndices(cX, cY)) {
                let cellN =this.grid[cX][cY];
                cellN.heading = cell.heading;
                cellN.cX=cell.heading+ Math.cos(cell.heading)*5;
                listOfNeighbours.push(cellN);
            }
        }
        return listOfNeighbours;
    }


    
    getCellIndexByPositionA(x, y) {
        let _x = Math.abs(Math.ceil(((-this.width / 2) - x) / this.cellSize));
        let _y = Math.abs(Math.ceil(((-this.height / 2) - y) / this.cellSize));
        if (this.isValidCellIndices(_x, _y)) {
            this.grid[_x][_y].vX =((-this.width / 2) - x) ;// this.cellSize;
            this.grid[_x][_y].vY =((-this.height / 2) - y) ;// this.cellSize;
            return this.grid[_x][_y];//{ x: _x, y: _y };
        }
        return null;
    }

    getHybridAStarNeighbours(cell) {
        let neighbours=[];
        // Generate 3 points in fwd and reverse rotation position.
        let fwdDist = 50;//this.vehicle.turningRadius
        //Front Point
        let pc = createVector();
        pc.x = cell.vX + Math.cos(cell.heading) * fwdDist;
        pc.y = cell.vY + Math.sin(cell.heading) * fwdDist;
        // circle(pc.x,pc.y,20); 

        for(let i=-(Math.PI/2);i<=(Math.PI/2);i+=0.3){

            let newCell = rotatePoint(pc.x, pc.y, i,  createVector(cell.vX,cell.vY));   
            let c = this.getCellIndexByPositionA(newCell.x,newCell.y);
            if(cell!=c&&c){
                c.vX=newCell.x;
                c.vY=newCell.y;
                c.heading = Math.atan2(c.vY-cell.vY,c.vX-cell.vX);
                neighbours.push(c);
            }
        }
        return neighbours;
    }
    getDistance(A, B) {
        // print(A);
        return dist(A.i, A.j, B.i, B.j);
        // return dist(A.pX, A.pY, B.pX, B.pY);
    }
}