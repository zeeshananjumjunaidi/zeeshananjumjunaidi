class Cell {

    constructor(id, x, y, value = 0, isBlocked = false, parent = null, isVisited = false, cellSize) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = value;
        this.isBlocked = isBlocked;
        this.indexCost = x + y;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.angleCost=0;
        this.parent = parent;
        this.isVisited = isVisited;
        this.cellSize = cellSize;
        this.pX = (x * cellSize) + (cellSize / 2);
        this.pY = (y * cellSize) + (cellSize / 2);
        this.destPointX=this.pX;
        this.destPointY=this.pY;
        this.heading = 0;// vehicle/target heading
        this.vX = 0;// vehicle/target X
        this.vY = 0;// vehicle/target Y
        this.neighbours = [];
        this.isStart = false;
        this.isGoal = false;
        this.isPath = false;
        this.forwardGear=true;

        // this.selectedHeading = this.heading;
        this.hn = [];
    }
    show() {
        stroke(0);
        if (this.isVisited) {
            fill(255, 50);
        } else
            if (this.isPath) {
                fill(60, 50, 50);
            } else
                if (this.isStart) {

                    fill(0, 250, 200);
                } else if (this.isCurrent) {
                    fill(150, 250, 0);
                }
                else if (this.isGoal) {
                    fill(200, 0, 0);
                } else
                    if (this.isBlocked) {
                        fill(150);
                    } else {
                        fill(200);
                    }
        rect(this.pX, this.pY, this.cellSize, this.cellSize);

        // fill(255);
        //text(this.heading.toFixed(2), this.pX, this.pY);
    }
    showMovements() {

        // this.visualizeSingleCell();
        stroke(100, 100, 0);
        strokeWeight(2);
        fill(0, 200, 0);

        if (this.isPath || this.isStart || this.isGoal) {

            if (this.hn) {
                for (let h = 0; h < this.hn.length; h++) {
               //     line(this.pX, this.pY, this.hn[h].pX, this.hn[h].pY);
                 //   circle(this.hn[h].pX, this.hn[h].pY, 5);
                }
            }
            fill(255,0,0)
          //  circle(this.destPointX, this.destPointY, 15);

            // let nx = this.pX + Math.cos(this.heading) * this.cellSize;
            // let ny = this.pY + Math.sin(this.heading) * this.cellSize;
            stroke(0, 255, 0);
            // line(this.pX, this.pY, nx, ny);
            // stroke(220, 255, 0);
            if(this.isGoal){
                circle(this.pX,this.pY,10);
            }
            // c.destPointX=c.pX+pp[0];
            // c.destPointY=c.pY+pp[1];
            if (this.parent){ strokeWeight(4);
                line(this.parent.destPointX, this.parent.destPointY, this.destPointX, this.destPointY);
                strokeWeight(2);
                noFill();
                circle(this.destPointX,this.destPointY,10);
            }
        }
        strokeWeight(1);
        noFill();
        stroke(0, 200, 0);
        if (this.isPath) {
            push();
            translate(this.pX, this.pY);
            rotate(this.heading);
            rect(0, 0, 50, 30);
            noStroke();
            fill(150);
            textSize(12);
            // text(this.selectedHeading.toFixed(2), 0, 13);
            pop();
        }
        // if (this.isGoal && this.isPath) {
        //     stroke(100, 100, 0);
        //     strokeWeight(4);
        //     fill(0, 200, 0);
        //     // circle(this.pX,this.pY,30);
        //     let nx = this.pX + Math.cos(this.heading) * this.cellSize;
        //     let ny = this.pY + Math.sin(this.heading) * this.cellSize;
        //     stroke(0, 255, 0);
        //     line(this.pX, this.pY, nx, ny);
        //     noStroke();
        //     fill(0);
        //     text(this.heading.toFixed(2), 100, 100);
        //     // text(this.selectedHeading.toFixed(2), 100, 150);
        // }
        // 0.698132 radian = 40 deg
        //   this.visualizeSingeCell();
        // if (this.isPath||this.isStart) {
        //     strokeWeight(5);
        //     stroke(0, 0, (this.id*10)%255);
        //     let nx = this.pX + Math.cos(this.heading) * this.cellSize;
        //     let ny = this.pY + Math.sin(this.heading) * this.cellSize;
        //     line(this.pX, this.pY, nx, ny);
        //     circle(this.pX, this.pY, 10);
        // }
    }
    visualizeSingleCell() {
        stroke(1);
        fill(0);
        noStroke();
        text(this.x, this.pX - 15, this.pY - 10);
        text(this.y, this.pX + 10, this.pY + 15);
        text(this.id, this.pX, this.pY);


        // if (this.y == 5 && this.x == 5) {
        //     push();
        //     translate(this.pX,this.pY);
        //     rotate(this.heading);
        //     rect(0,0,10,10);
        //     pop();
        //     let possiblePoints = [];
        //     for (let i = this.heading - 0.698132;
        //         i < this.heading + 0.698132; i += 0.5) {
        //         let nx =  Math.cos(i) * this.cellSize;
        //         let ny =  Math.sin(i) * this.cellSize;

        //        possiblePoints.push([nx, ny]);
        //     }
        //     // 4/3PI, 
        //     for (let i =this.heading +(3/4* Math.PI);
        //         i <this.heading+ (4/3*Math.PI); i +=0.7) {
        //         let nx =  Math.cos(i) * this.cellSize;
        //         let ny =  Math.sin(i) * this.cellSize;

        //         possiblePoints.push([nx, ny]);
        //     }
        //     // let nx =  Math.cos(Math.PI+Math.PI/2) * this.cellSize;
        //     // let ny =  Math.sin(Math.PI+Math.PI/2) * this.cellSize;
        //     // circle(this.pX+nx,this.pY+ny,10);

        //     for (let i = 0; i < possiblePoints.length; i++) {
        //         let pp = possiblePoints[i];
        //         fill(0, 0, 255);
        //         stroke(1);
        //         let x =this.pX+this.round(this.cellSize,pp[0]);
        //         let y =this.pY+this.round(this.cellSize,pp[1]);
        //         noStroke();
        //         stroke(0, 255, 0);
        //         rect(x, y, this.cellSize, this.cellSize);
        //         line(this.pX, this.pY, pp[0]+this.pX, pp[1]+this.pY);                
        //         circle(pp[0]+this.pX, pp[1]+this.pY, 5);

        //         // rect(25,25,25,25);
        //     }
        // }
    }
    round(snapValue, input) {
        return snapValue * Math.round((input / snapValue));
    }
}