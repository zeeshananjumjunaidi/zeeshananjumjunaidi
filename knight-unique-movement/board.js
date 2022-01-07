class Board {
    constructor(grid, cellSize = 100, padding = 5) {
        this.rowsCount = grid.length;
        this.colCount = grid[0].length;
        this.grid = grid;
        this.cells = [];
        for (let r = 0; r < this.rowsCount; r++) {
            this.cells.push([]);
            for (let c = 0; c < this.colCount; c++) {
                this.cells[r].push(new Cell(r, c, grid[r][c]));
            }
        }
        this.cellSize = cellSize;
        this.padding = padding;
    }
    draw() {
        for (let r = 0; r < this.rowsCount; r++) {
            for (let c = 0; c < this.colCount; c++) {
                let cell = this.cells[c][r];
                const dx = cell.x * this.cellSize + this.padding;
                const dy = cell.y * this.cellSize + this.padding;
                if (cell.isVisited) {
                    fill(200,200,200);
                    stroke(50,50,50);
                    strokeWeight(2)
                } else {
                    fill(220);
                    noStroke();
                }
                rect(dx, dy, this.cellSize - this.padding, this.cellSize - this.padding);
                fill(0);
                noStroke();
                text(this.cells[r][c].value, dx, dy);
            }
        }
    }
}