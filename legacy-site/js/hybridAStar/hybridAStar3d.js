class HybridAStar3d {
    constructor(width, height, cellSize, scene) {
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.cellSize = cellSize;
        this.cellSizeH = cellSize / 2;
        this.rows = Math.round(width / cellSize);
        this.cols = Math.round(height / cellSize);
        this.padding = 0.25 * this.cellSize;
        console.log("Initialized Hybrid A*", this);
        this.vehicle = undefined;
        this.grid = [];
        this.currentCell = undefined;
        this.goalCell = undefined;
        this.isGoalReached = false;
        this.finishedAStarPath = [];
        this.generateGrid();
        this.nextPos = [];
    }

    /// A* Algorithm
    /// Converting A* into Hybrid A*
    solve() {
        this.generateGrid();
        this.updateVehicleCellIndices();
        let start = this.currentCell;
        let goal = this.goalCell;
        if (start)
            start.value = 1;
        if (goal)
            goal.value = 3;
        this.isGoalReached = false;
        if (!start) return;
        let openSet = [start];
        let closedSet = [];
        let current = start;
        // this.nextPos = this.getHybridAStarNeighbours(this.currentCell);
        while (!this.isGoalReached && openSet.length > 0) {

            openSet.sort((a, b) => { return b.f - a.f });
            openSet.reverse();
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i; // this will remove cell from openList and assign to current
                }
            }
            current = openSet[lowestIndex];

            openSet.splice(lowestIndex, 1);
            closedSet.push(current);
            if (current.i == goal.i && current.j == goal.j) {
                this.isGoalReached = true;
                current.value = 2;
                this.reconstructPath(current);
                // reconstructPath
            }
            // Here we will get neighbours based on 
            // our vehicle heading and orientation.
            current.neighbours = this.getAStarNeighbors(current);
            // current.neighbours =this.getHybridAStarNeighbours(current);
            for (let neighbour of current.neighbours) {
                // checking for blocked
                if (neighbour.isBlocked) {
                    continue;
                }
                if (!closedSet.includes(neighbour)) {
                    let tentative_gScore = current.g + Math.abs(current.heading) + Math.abs(neighbour.heading);

                    if (openSet.includes(neighbour)) {
                        if (tentative_gScore < neighbour.g) {
                            neighbour.g = tentative_gScore;
                        }
                    } else {
                        neighbour.g = tentative_gScore;
                        openSet.push(neighbour);
                    }
                    neighbour.h = this.getDistance(neighbour, goal);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = current;
                    neighbour.isVisited = true;

                }
            }
        }
        this.goalCell.value = 1;
        this.currentCell.value = 3;
    }
    getAStarNeighbors(cell) {
        let neighbors = [];
        for (let n of [[-1, -1], [1, 1], [-1, 1], [1, -1], [0, -1], [-1, 0], [1, 0], [0, 1]]) {
            if (this.isValidCellIndices(cell.i + n[0], cell.j + n[1])) {
                if (!this.grid[cell.i + n[0]][cell.j + n[1]].isBlocked &&
                    !this.grid[cell.i + n[0]][cell.j + n[1]].isVisited)
                    neighbors.push(this.grid[cell.i + n[0]][cell.j + n[1]]);
            }
        }
        return neighbors;
    }


    getHybridAStarNeighbours(cell) {
        let neighbours = [];
        // Generate 3 points in fwd and reverse rotation position.
        let fwdDist = 20000;//this.cellSizeH/2;// 5000;//this.vehicle.turingRadius;//this.vehicle.turningRadius
        //Front Point
        let pc = new THREE.Vector3();
        pc.x = cell.vX + Math.sin(cell.heading) * fwdDist;
        pc.y = cell.vY;//+ Math.sin(cell.heading) * fwdDist;
        pc.z = cell.vZ + Math.cos(cell.heading) * fwdDist;
        // console.log(fwdDist);
        let ij = [];
        for (let i = -(Math.PI / 2); i <= (Math.PI / 2); i += 0.3) {
            let newCell = rotatePoint(pc.x, pc.z, i, new THREE.Vector2(cell.vX, cell.vZ));
            let c = this.getCellIndexByPositionA(newCell.x, newCell.y);
            if (c && cell != c) {
                c.vX = newCell.x;
                c.vY = cell.y;
                c.vZ = newCell.y;
                c.heading = Math.atan2(c.vX - cell.vX, c.vZ - cell.vZ);
                neighbours.push(c);
                ij.push({ i: c.i, j: c.j });
            }
        }
        return neighbours;
    }
    reconstructPath(cell) {
        this.finishedAStarPath = [];
        let current = cell;
        while (current) {
            this.finishedAStarPath.push(current);
            current.value = 2;
            current = current.parent;
        }
    }
    generateGrid() {
        this.grid = [];
        let a = 0;
        let id = 0;
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            let b = 0;
            for (let j = 0; j < this.cols; j++) {
                let x = i * this.cellSize;
                let y = j * this.cellSize;
                this.grid[i].push(
                    new Cell(id++, x, 0, y, 0, false, null, false, this.cellSize));
                this.grid[i][j].i = a;
                this.grid[i][j].j = b++;
                this.grid[i][j].pX = x;
                this.grid[i][j].pY = 0;
                this.grid[i][j].pZ = y;
            }
            a++;
        }
        for (let i = 0; i < 10; i++) {
            this.grid[5][i].isBlocked = true;
            this.grid[i + 5][10].isBlocked = true;
            this.grid[i + 8][12].isBlocked = true;
            this.grid[i + 10][11].isBlocked = true;
            this.grid[15][15 - i].isBlocked = true;
        }
    }

    setVehicle(vehicle) {
        this.vehicle = vehicle;
    }

    updateVehicleCellIndices() {
        this.updateVehicleGridIndex();
        this.updateVehicleTargetGridIndex();
        //   this.getNeighbourCellsNearVehicle();
    }

    updateVehicleTargetGridIndex() {
        if (this.goalCell) {
            this.goalCell.value = 0;
        }
        let x = Math.abs(Math.round((this.vehicle.tPosition.x) / this.cellSize));
        let z = Math.abs(Math.round((this.vehicle.tPosition.z) / this.cellSize));
        if (this.isValidCellIndices(x, z)) {
            this.grid[x][z].value = 3;
            this.goalCell = this.grid[x][z];
            this.goalCell.cX = this.vehicle.tPosition.x;
            this.goalCell.cY = this.vehicle.tPosition.y;
            this.goalCell.cZ = this.vehicle.tPosition.z;
            this.goalCell.vX = this.vehicle.tPosition.x;
            this.goalCell.vY = this.vehicle.tPosition.y;
            this.goalCell.vZ = this.vehicle.tPosition.z;
            this.goalCell.heading = this.vehicle.tHeading;

        }
    }

    updateVehicleGridIndex() {
        if (this.currentCell) {
            this.currentCell.value = 0;
        }
        let x = Math.abs(Math.round((this.vehicle.position.x) / this.cellSize));
        let z = Math.abs(Math.round((this.vehicle.position.z) / this.cellSize));
        if (this.isValidCellIndices(x, z)) {
            this.grid[x][z].value = 1;
            this.currentCell = this.grid[x][z];
            this.currentCell.cX = this.vehicle.position.x;
            this.currentCell.cY = this.vehicle.position.y;
            this.currentCell.cZ = this.vehicle.position.z;

            this.currentCell.vX = this.vehicle.position.x;
            this.currentCell.vY = this.vehicle.position.y;
            this.currentCell.vZ = this.vehicle.position.z;

            this.currentCell.heading = this.vehicle.heading;
        }
    }
    getNeighbourCellsNearVehicle() {
        let fwdDist = this.cellSize / 2;//this.vehicle.turningRadius
        //Front Point
        let pc = new THREE.Vector3();
        pc.x = this.vehicle.position.x + Math.cos(this.vehicle.heading) * fwdDist;
        pc.z = this.vehicle.position.z + Math.sin(this.vehicle.heading) * fwdDist;
        // Left Point
        let lPoint = rotatePoint(pc.x, pc.z, Math.PI / 2, this.vehicle.position);
        // Right Point
        let rPoint = rotatePoint(pc.x, pc.z, -Math.PI / 2, this.vehicle.position);
        // fill(255);
        // drawCircle(pc, 10);
        // drawCircle(lPoint, 10);
        // drawCircle(rPoint, 10);
        let fCell = this.getCellIndexByPosition(pc.x, pc.z);
        let rCell = this.getCellIndexByPosition(rPoint.x, rPoint.z);
        let lCell = this.getCellIndexByPosition(lPoint.x, lPoint.z);
        return [fCell, rCell, lCell];

    }
    getCellIndexByPosition(x, y) {
        let _x = Math.abs(Math.ceil((x) / this.cellSize));
        let _y = Math.abs(Math.ceil((y) / this.cellSize));
        if (this.isValidCellIndices(_x, _y)) {
            return this.grid[_x][_y];//{ x: _x, y: _y };
        }
        return null;
    }

    getCellIndexByPositionA(x, y) {
        let _x = Math.abs(Math.ceil((x) / this.cellSize));
        let _y = Math.abs(Math.ceil((y) / this.cellSize));
        if (this.isValidCellIndices(_x, _y)) {
            this.grid[_x][_y].vX = (x);// this.cellSize;
            this.grid[_x][_y].vY = (y);// this.cellSize;
            return this.grid[_x][_y];//{ x: _x, y: _y };
        }
        return null;
    }

    isValidCellIndices(x, z) {
        if (x >= 0 && z >= 0 && x <= this.rows - 1 && z <= this.cols - 1) {
            return true;
        }
        return false;
    }
    getDistance(A, B) {
        // print(A);
        return Math.sqrt(Math.pow(B.j - A.j, 2) + Math.pow(B.i - A.i, 2));// A.distanceTo(B);// dist(A.i, A.j, B.i, B.j);
        // return dist(A.pX, A.pY, B.pX, B.pY);
    }
}