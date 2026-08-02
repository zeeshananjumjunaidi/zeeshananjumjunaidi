class AStar{
    constructor(width, height, cellSize,scene) {
        this.width = width;
        this.height = height;
        this.scene=scene;
        this.cellSize = cellSize;
        this.cellSizeH = cellSize/2;
        this.rows = Math.round(width / cellSize);
        this.cols = Math.round(height / cellSize);
        this.padding = 0.25*this.cellSize;
        console.log("Initialized A*", this);
        this.vehicle = undefined;
        this.grid = [];
        this.currentCell = undefined;
        this.goalCell = undefined;
        this.isGoalReached = false;
        this.finishedAStarPath=[];
        this.generateGrid();
        this.nextPos=[];
    } 
    solve(){
        this.generateGrid();
        
    }

}