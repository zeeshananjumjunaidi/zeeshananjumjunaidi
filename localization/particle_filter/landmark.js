class Landmark{
    constructor(x,y,id){
        this.x=x;
        this.y=y;
        this.id=id;
    }
    draw(){
        fill(0);
        rect(this.x,this.y,20,20,5,5);
        fill(250);
        text(this.id,this.x,this.y);
    }
}