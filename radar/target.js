
class Target{
    constructor(id,x,y,heading,speed=1,altitude=2000,size=10){
        this.id=id;
        this._x=x;
        this._y=y;
        this.x=x;
        this.y=y;
        this.heading=heading;
        this.speed=speed;
        this.size=size;
        //altitude in feet
        this.altitude=altitude;
        this.selected=false;
        this.hover=false;
    }
    draw(){
        if(this.hover){
            noFill();
            stroke(255,0,0);
            circle(this.x,this.y,this.size*2);
        }
        fill(255,0,0);
        circle(this.x,this.y,this.size);
        this.x+=Math.cos(this.heading)*this.speed;
        this.y+=Math.sin(this.heading)*this.speed;
        if(this.x>width){this.x=this._x;this.y=this._y;}
        if(this.y>height){this.x=this._x;this.y=this._y;}
        fill(0,255,0);
        if(this.selected){
        text(`${this.x.toFixed(2)},${this.y.toFixed(2)}
        ${this.altitude.toFixed(2)}
        `,this.x,this.y+10);}else{
            text(Math.sqrt((this.x*this.x)+(this.y*this.y)).toFixed(2),this.x,this.y);
        }
      
    }
}