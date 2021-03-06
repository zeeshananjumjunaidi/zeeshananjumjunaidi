
class Lidar {

    constructor(vehicle, xOffset = 0, yOffset = 0, rpm = 300, noOfRays = 100, range = 300, debug = true) {
        this.vehicle = vehicle;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.position = createVector(this.vehicle.position.x, this.vehicle.position.y);
        this.position = p5.Vector.add(this.position, createVector(xOffset, yOffset));
        this.rpm = rpm;
        this.noOfRays = noOfRays;
        this.debug = debug;
        this.range = range;
        this.rays = [];
        this.initializeSensor();
        window.rays = this.rays;
        this.map=[];
        this.mapPointer=0;
        for(let i=0;i<200;i++){
            // x,y, weight
            this.map.push([0,0,0]);
        }
    }
    initializeSensor() {
        for (let i = 0; i < 200; i +=1) {
            this.rays.push(new Ray(this.vehicle.position, i, 100));
        }
    }
    toggleDebug() {
        this.debug = !this.debug;
    }
    
    vectorDist(v1,v2){
        return dist(v1.x,v1.y,v2.x,v2.y);
    }
    scan() {
        fill(255)
        strokeWeight(1)
        // update LIDAR position
        this.position = createVector(this.vehicle.position.x, this.vehicle.position.y);
        this.position = p5.Vector.add(this.position, createVector(this.xOffset, this.yOffset));
        let i = 0;
        let incr = (Math.PI * 2) / this.noOfRays;
        for (let ray of this.rays) {
            let lookX = Math.cos(i) * 180;
            let lookY = Math.sin(i) * 180;
            i += incr;
            ray.lookAt(lookX, lookY);
            let rec = Infinity;
            let closestPoint = null;
            ray.pos=this.vehicle.position;
            if(!this.vehicle||!this.vehicle.environment)
                continue;
            for (let wall of this.vehicle.environment.walls) {
                let pt = ray.cast(wall);
                if (pt) {

                    const distance = this.vectorDist(this.position, pt);
           
                    if (distance < rec && distance < this.range) {
                        closestPoint = pt;
                        rec = distance;

                    }
                } else {
                    //  ray.show();
                }
                // ray.update();
            }
            if(closestPoint){
                fill(255,0,0);
                drawCircle(closestPoint,5);
                stroke(2550,0,0,50);
                ray.pos = this.position;
                line(ray.pos.x,ray.pos.y,closestPoint.x,closestPoint.y);    
                let newPoint = true;     
                for(let m=0;m<this.map.length;m++){
                    if(dist(this.map[m][0],this.map[m][1],closestPoint.x,closestPoint.y)<10)
                    {newPoint=false; break;}
                }       
                if(newPoint){
                this.map[this.mapPointer++]=[closestPoint.x,closestPoint.y,5];
                if(this.mapPointer>=this.map.length){this.mapPointer=0;}
            }

                noFill();

                noStroke();
            }
        }
        for(let i=0;i<this.map.length;i++){
            stroke(0,0,255);
            strokeWeight(this.map[i][2]);
            point(this.map[i][0],this.map[i][1]);
        }
    }

}