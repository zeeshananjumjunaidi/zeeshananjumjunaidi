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
    draw() {
        if (this.x != undefined && this.y != undefined) {
            const dx = this.x * this.cellSize + this.padding;
            const dy = this.y * this.cellSize + this.padding;
            image(this.knightImage, dx, dy);
        }
    }

    /**
     * 
     * @param {number} x column position on board
     * @param {number} y row position on board
     * @returns {boolean} return true if move is successful otherwise false
     */
    move(x, y) {
        print('moving', x, y)
        let dx = x + this.x; // Col
        let dy = y + this.y; // Row
        if (this.isValid(dx, dy, false)) {
            this.x = dx;
            this.y = dy;
            this.board.cells[this.x][this.y].isVisited = true;
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
            this.x = x; this.y = y;
            this.setCellVisited(x, y);
            return true;
        }
        return false;
    }
    /**
   * Move like a knight ♞
   * @param {number} x moving direction left(-1) or right(1)
   * @param {number} y moving direction up(-1) or down(1)
   * @returns {boolean} return true if move is successful otherwise false
   */
    knightMovement(x, y) {
        if (this.isValid(x, y)) {
            this.x = x; this.y = y;
            return true;
        }
        return false;
    }

    getKnightsTargetNeighbours() {
        let targetNeighbours = []
        // there are 8 possible cells on grid
        // where knight might move in L shape
        for (let i = 0; i < 8; i++) {
            let dx = this.x + this.xMovement[i];
            let dy = this.y + this.yMovement[i];
            if (this.isValid(dx, dy)) {
                targetNeighbours.push(this.board.cells[dx][dy]);
            }
        }
        return targetNeighbours;
    }
    getNeighboursByKnightMovement(cell, closedList = []) {
        let targetNeighbours = []
        // there are 8 possible cells on grid
        // where knight might move in L shape
        for (let i = 0; i < 8; i++) {
            let dx = cell.x + this.xMovement[i];
            let dy = cell.y + this.yMovement[i];
            if (this.isValid(dx, dy) && !closedList.find(x => x.value == this.board.cells[dx][dy].value)) {
                targetNeighbours.push(this.board.cells[dx][dy]);
            }
        }
        return targetNeighbours;
    }

    travel(stringSize) {
        stringSize = 3;
        console.log(`solving for string size ${stringSize}`);
        // create adjacency list
        let adjacencyList = {};
        for (let r = 0; r < this.board.rowsCount; r++) {
            for (let c = 0; c < this.board.colCount; c++) {
                let cell = this.board.cells[r][c];
                if (cell.value != ' ')
                    adjacencyList[cell.value] = this.getNeighboursByKnightMovement(cell).map(c => c.value);
            }
        }
        console.log(adjacencyList);
        let results = [];

        for (let a in adjacencyList) {
            let letter =adjacencyList[a];
            this.dfs()
        }

        console.log(results);

    }
    travelX(stringSize) {
        stringSize = 3;// for testing only
        console.log(`solving for string size ${stringSize}`);
        let travelledSteps = 0;
        let stringSequences = [];

        for (let r = 0; r < this.board.rowsCount; r++) {
            for (let c = 0; c < this.board.colCount; c++) {
                let currentStringSize = 0;
                let currentWord = '';
                const cell = this.board.cells[r][c];
                if (cell.value == ' ') continue;
                let moved = this.set(cell.x, cell.y);
                this.board.setAllCellsUnvisited();
                // initial position placement is considered as valid movement
                if (moved) {
                    currentStringSize++; currentWord += cell.value;
                    cell.isVisited = true;
                    // if currentString size is not matched yet
                    // then we will travel(jump) to another cells
                    if (currentStringSize != stringSize) {

                        let openList = this.getKnightsTargetNeighbours();
                        while (openList.length > 0) {
                            let current = openList.pop();
                            current.isVisited = true;
                            currentWord += current.value;
                            currentStringSize++;
                            if (currentStringSize == stringSize) {
                                stringSequences.push(currentWord);
                                travelledSteps += currentStringSize;
                                currentWord = cell.value;
                                currentStringSize = 1;
                                // break;
                            } else {
                                // let cR = this.x;
                                // this.cC = this.y;
                                this.x = current.x;
                                this.y = current.y;
                                let newTargetPositions = this.getKnightsTargetNeighbours();

                                openList = openList.concat(newTargetPositions);
                            }

                            // if (targetPositions.length > 0) {
                            //     let kmoved = this.knightMovement(this.r, this.c);
                            //     if (kmoved) {
                            //         currentWord += current.value;
                            //         currentStringSize++;
                            //     }
                            // }
                        }
                    }
                    stringSequences.push(currentWord);
                    travelledSteps += currentStringSize;
                }
            }
        }
        print(travelledSteps, stringSequences)

        // let openSet = [this.board.cells[this.x][this.y]];
        // let hashMap = {}
        // let distinctCount = 0;
        // while (openSet.length > 0) {
        //     let current = openSet.pop();
        //     current.isVisited = true;
        //     if (current.value != ' ' && current.value in hashMap == false) {
        //         distinctCount += 1;
        //         hashMap[current.value] = true;
        //         if (distinctCount === stringSize) {
        //             travelledSteps += 1;
        //         }
        //     }
        //     let neighbours = this.getKnightsTargetNeighbours(current);
        //     neighbours.forEach(neighbour => {
        //         openSet.push(neighbour);
        //     });
        // }
    }
    setCellVisited(x, y) {
        this.board.cells[x][y].isVisited = true;
    }
}