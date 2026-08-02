class Environment{
    constructor(){
        this.walls=[];
    }
    addWall(x1,y1,x2,y2){
        this.walls.push(new Wall(x1,y1,x2,y2));
    }
    show(){
        
        stroke(0,50);
        strokeWeight(2);
        for(let wall of this.walls){
            wall.show();
        }
    }
}