class Parking{

    constructor(lVehicle,rVehicle,sideLine,vehicle){
        this.lVehicle=lVehicle;
        this.rVehicle=rVehicle;
        this.vehicle=vehicle;
        this.sideLine=sideLine;
    }


    draw(){
        // This points would be computed using 
        // computer vision, and sensor fusion.
        fill(255,0,0);
        let size=5;
        let vP = this.vehicle.position;
        let rP = this.rVehicle.position;
        let lP = this.lVehicle.position;
        let vHeading = this.vehicle.heading;
        let rHeading = this.rVehicle.heading;
        let lHeading = this.lVehicle.heading;
        let scaleFactor=50;
       // let ftrP = new p5.Vector(Math.cos(vHeading+PI0_3)*scaleFactor+vP.x,Math.sin(vHeading+PI0_3)*scaleFactor+vP.y);
       // let ftlP = new p5.Vector(Math.cos(vHeading-PI0_3)*scaleFactor+vP.x,Math.sin(vHeading-PI0_3)*scaleFactor+vP.y);
        //  circle(ftrP.x,ftrP.y,size*2);
        //  circle(ftlP.x,ftlP.y,size*2);
        //  line(ftrP.x,ftrP.y,ftlP.x,ftlP.y);
        //    PI0_3+=Math.PI;
        // let btrP = new p5.Vector(Math.cos(vHeading-PI0_3)*scaleFactor+vP.x,Math.sin(vHeading-PI0_3)*scaleFactor+vP.y);
        // let btlP = new p5.Vector(Math.cos(vHeading+PI0_3)*scaleFactor+vP.x,Math.sin(vHeading+PI0_3)*scaleFactor+vP.y);
        //   circle(btrP.x,btrP.y,size*2);
        //   circle(btlP.x,btlP.y,size*2);
        //   line(btrP.x,btrP.y,btlP.x,btlP.y);
        let points = this.boundingPoints(vHeading,vP);
        this.displayBoundingBox(points);
        points = this.boundingPoints(rHeading,rP);
        this.displayBoundingBox(points);
        points = this.boundingPoints(lHeading,lP);
        this.displayBoundingBox(points);

        circle(lP.x,lP.y,size);
        circle(rP.x,rP.y,size);
        circle(vP.x,vP.y,size);
        noFill();
        circle(vP.x,vP.y,vehicle.turningRadius/2);

    }
    displayBoundingBox(points){
        line(points[0].x,points[0].y,points[1].x,points[1].y);
        line(points[2].x,points[2].y,points[3].x,points[3].y);

        line(points[0].x,points[0].y,points[2].x,points[2].y);
        line(points[1].x,points[1].y,points[3].x,points[3].y);
    }
    boundingPoints(heading,vP,scaleFactor=50){
        let PI0_3=Math.PI*0.2;
        let points=[];
        let ftrP = new p5.Vector(Math.cos(heading+PI0_3)*scaleFactor+vP.x,Math.sin(heading+PI0_3)*scaleFactor+vP.y);
        let ftlP = new p5.Vector(Math.cos(heading-PI0_3)*scaleFactor+vP.x,Math.sin(heading-PI0_3)*scaleFactor+vP.y);
        // circle(ftrP.x,ftrP.y,size*2);        
        // circle(ftlP.x,ftlP.y,size*2);        
        // line(ftrP.x,ftrP.y,ftlP.x,ftlP.y);
        PI0_3+=Math.PI;
         let btrP = new p5.Vector(Math.cos(heading-PI0_3)*scaleFactor+vP.x,Math.sin(heading-PI0_3)*scaleFactor+vP.y);
         let btlP = new p5.Vector(Math.cos(heading+PI0_3)*scaleFactor+vP.x,Math.sin(heading+PI0_3)*scaleFactor+vP.y);
        points.push(ftrP,ftlP,btrP,btlP);
          
        //  circle(btrP.x,btrP.y,size*2);
        //   circle(btlP.x,btlP.y,size*2);
        //   line(btrP.x,btrP.y,btlP.x,btlP.y);
        
        //   line(btrP.x,btrP.y,ftrP.x,ftrP.y);
        //   line(btlP.x,btlP.y,ftlP.x,ftlP.y);
        return points;
    }
}