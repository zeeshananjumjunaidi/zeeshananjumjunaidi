class HybridAStarMap {

    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
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
                this.grid[i].push(new Cell(id++, x, y, 0, false, null, false, this.cellSize));
                this.grid[i][j].i = a;
                this.grid[i][j].j = b++;
                this.grid[i][j].pX = x;
                this.grid[i][j].pY = y;
            }
            a++;
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].neighbours = this.getNeighbourCells(this.grid[i][j]);
            }
        }
        // add some testing obstacles
        this.grid[7][5].isBlocked=true;
        this.grid[7][6].isBlocked=true;
        this.grid[6][7].isBlocked=true;
    }

}