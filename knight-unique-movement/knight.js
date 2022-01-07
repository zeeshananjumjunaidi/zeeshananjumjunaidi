class Knight {
    constructor(x, y, board, knightImage, cellSize = 100, padding = 5) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.cellSize = cellSize;
        this.padding = padding;
        this.knightImage = knightImage;
        this.xMovement = [2, 2, -2, -2, 1, 1, -1, -1];
        this.yMovement = [1, -1, 1, -1, 2, -2, 2, -2];

        this.board.cells[x][y].isVisited = true;
    }
    isValid(x, y) {
        if (x >= 0 && x < this.board.colCount && y >= 0 && y < this.board.rowsCount)
            return true;
        return false;
    }
    draw() {
        const dx = this.x * this.cellSize + this.padding;
        const dy = this.y * this.cellSize + this.padding;
        image(this.knightImage, dx, dy);
    }
    move(x, y) {
        print('moving', x, y)
        let dx = x + this.x; // Col
        let dy = y + this.y; // Row
        if (this.isValid(dx, dy)) {
            this.x = dx;
            this.y = dy;
            this.board.cells[this.x][this.y].isVisited=true;
        }
    }
}