class Airport{
    constructor(x,y,id=123){
        this.x=x;
        this.y=y;
        this.id=id;
    }
    draw(){
        fill(255,0,0);
        circle(this.x,this.y,10);
        noFill();
        stroke(255,0,255);
        line(this.x-100,this.y-100,this.x+100,this.y+200);
        line(this.x-200,this.y-50,this.x+100,this.y-50);
    }

}