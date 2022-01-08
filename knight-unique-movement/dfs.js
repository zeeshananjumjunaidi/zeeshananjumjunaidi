
class DFS {
    constructor(board) {
        this.board = board;
        this.xMovement = [2, 2, -2, -2, 1, 1, -1, -1];
        this.yMovement = [1, -1, 1, -1, 2, -2, 2, -2];
        this.adjacencyList = {};
        for (let r = 0; r < this.board.rowsCount; r++) {
            for (let c = 0; c < this.board.colCount; c++) {
                let cell = this.board.cells[r][c];
                if (cell.value != ' ')
                    this.adjacencyList[cell.value] = this.getNeighboursByKnightMovement(cell).map(c => c.value);
            }
        }
    }
    solve(numberOfMoves) {
        console.info(this.adjacencyList);
        // generate all paths for A
        let allSequences = new Set()
        for (let x in this.adjacencyList) {
            let startChar = x;
            console.info(`starting sequence of ${startChar} with length ${numberOfMoves}`)
            // creating tree for startChar as root with depth numberOfMoves

            let root = new TreeNode(startChar);
            root.word = startChar;
            this.createTree(startChar, numberOfMoves, numberOfMoves - 1, root, startChar, { startChar }, allSequences);
            // console.log(root, allSequences);
        }
        console.log(allSequences);
        return allSequences;
    }

    createTree(char, wordLen, clen, root, currentWord = '', closedSet = {}, allSequences) {
        // closedSet[root.value] = true;
        closedSet[char] = true;
        for (let a of this.adjacencyList[char]) {
            if (a in closedSet == false && clen > 0) {
                let newNode = new TreeNode(a);
                // if (root.word[root.word.length - 1] < a) {
                //     newNode.word = root.word + a;
                // }
                // else {
                //     newNode.word = a + root.word;
                // }
                newNode.word = root.word + a;
                currentWord += a;

                // root.children.push(newNode);
                this.createTree(a, wordLen, clen - 1, newNode, currentWord, closedSet, allSequences);
            } else {
                if (currentWord.length == wordLen) {
                    allSequences.add(currentWord)
                }
                // if (root.word.length == wordLen)
                //     allSequences.add(root.word)
            }
        }
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
}