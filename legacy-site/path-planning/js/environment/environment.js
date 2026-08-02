class Environment{
    constructor(){
        this.walls=[];
    }
    addWall(x1,y1,x2,y2){
        this.walls.push(new Wall(x1,y1,x2,y2));
    }
    show(){
        for(let wall of this.walls){
            wall.show();
        }
    }
}