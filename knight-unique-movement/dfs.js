const VOWELS = { 'A': 'A', 'E': 'E', 'I': 'I', 'O': 'O', 'U': 'U' }
Object.freeze(VOWELS);

class DFS {
    constructor(board, isDebug = false) {
        this.isDebug = isDebug;
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
     //   let allSequences = new Set()
        for (let x in this.adjacencyList) {
            let startChar = x;
            if (this.isDebug)
                console.info(`starting sequence of ${startChar} with length ${numberOfMoves}`)

            let closeSet = {};
            closeSet[startChar] = true;      
        }
        let answers = [];
        for (let x in this.adjacencyList) {
            let character = x;//'A';
            let word = `${character}`;
            let wordSize = numberOfMoves;
            let closedList = {}
            closedList[character] = true;
            let currentAnswers = [];
            let newAnswers = this.recursionTest(character, wordSize, --wordSize, word, closedList, currentAnswers)
            // answers = currentAnswers;
            answers = [...answers, ...newAnswers]
        }
        
        return answers;
    }

    doesNVowelsCount(word, char, limit = 2) {
        // we are checking on each iteration so
        // we can't skip second vowels ever.
        if (char in VOWELS) {
            if (word.length>1){
                if(VOWELS.A!=char && word.includes(VOWELS.A))
                    return true;
                    if(VOWELS.E!=char && word.includes(VOWELS.E))
                        return true;
                        if(VOWELS.I!=char && word.includes(VOWELS.I))
                            return true;
                            if(VOWELS.O!=char && word.includes(VOWELS.O))
                                return true;
                                if(VOWELS.U!=char && word.includes(VOWELS.U))
                                    return true;
            }
        }
        return false;
    }
    recursionTest(char, wordSize = 3, count = 3, word, closedList, answers) {
        let containsNVowels = this.doesNVowelsCount(word, char);
        if(containsNVowels){return answers;}
        if (word != char)
            word += char;
        count--;

        
        if (word.length == wordSize) {
            if (char)
                console.log(word);
            answers.push(word);
            return answers;
        }
        let neighbours = this.adjacencyList[char];
        for (let i = 0; i < neighbours.length; i++) {
            if (!(neighbours[i] in closedList)) {
                closedList[neighbours[i]] = true;
                this.recursionTest(neighbours[i], wordSize, count, word, closedList, answers);
            }
        }
        return answers;
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