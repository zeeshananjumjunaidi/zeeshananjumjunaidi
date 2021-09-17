

class GravitySource{
    constructor(x,y,mass,radius){
        this.x=x;
        this.y=y;
        this.mass=mass;
        this.radius=radius;
    }

    draw(){
        fill(255, 0, 0);
        circle(this.x,this.y,this.radius);
    }
}