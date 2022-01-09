class Knight {
    constructor(board, knightImage, cellSize = 100, padding = 5) {
        this.x = undefined;
        this.y = undefined;
        this.board = board;
        this.cellSize = cellSize;
        this.padding = padding;
        this.knightImage = knightImage;
        this.xMovement = [2, 2, -2, -2, 1, 1, -1, -1];
        this.yMovement = [1, -1, 1, -1, 2, -2, 2, -2];
    }
    
    isValid(x, y, considerCellVisited = true) {
        if (x >= 0 && x < this.board.colCount && y >= 0 && y < this.board.rowsCount) {
            if (considerCellVisited)
                if (this.board.cells[x][y].isVisited)
                    return false;
            if (this.board.cells[x][y].value == ' ')
                return false;
            return true;
        }
        return false;
    }
    

    /**
   * 
   * @param {number} x column position on board
   * @param {number} y row position on board
   * @returns {boolean} return true if move is successful otherwise false
   */
    set(x, y) {
        if (this.isValid(x, y)) {
            this.x = x;
            this.y = y;
            this.setCellVisited(x, y);
            return true;
        }
        return false;
    }

    /**
     * mark cell at x, y as visited
     * @param {number} x 
     * @param {number} y 
     */
    setCellVisited(x, y) {
        this.board.cells[x][y].isVisited = true;
    }

    /**
     * draw function of p5.js for UI
     */
    draw() {
        if (this.x != undefined && this.y != undefined) {
            const dx = this.x * this.cellSize + this.padding;
            const dy = this.y * this.cellSize + this.padding;
            image(this.knightImage, dx, dy);
        }
    }
}