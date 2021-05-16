
class Target{
    constructor(x,y,heading,speed=1,size=10){
        this._x=x;
        this._y=y;
        this.x=x;
        this.y=y;
        this.heading=heading;
        this.speed=speed;
        this.size=size;
    }
    draw(){
        circle(this.x,this.y,this.size);
        this.x+=Math.cos(this.heading)*this.speed;
        this.y+=Math.sin(this.heading)*this.speed;
        if(this.x>width){this.x=this._x;this.y=this._y;}
        if(this.y>height){this.x=this._x;this.y=this._y;}
    }
}