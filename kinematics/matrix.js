// Credit: https://rosettacode.org/wiki/Matrix_multiplication#JavaScript

class Matrix {
    constructor(mtx) {
        this.mtx = mtx;
        this.height = 0;
        this.width = 0;
        if (this.mtx.length > 0) {
            this.height = this.mtx.length;
            this.width = this.mtx[0].length;
        }
    }
    mult(other) {
        if (this.width != other.height) {
            throw "error: incompatible sizes";
        }

        var result = [];
        for (var i = 0; i < this.height; i++) {
            result[i] = [];
            for (var j = 0; j < other.width; j++) {
                var sum = 0;
                for (var k = 0; k < this.width; k++) {
                    sum += this.mtx[i][k] * other.mtx[k][j];
                }
                result[i][j] = sum;
            }
        }
        return new Matrix(result);
    }

}