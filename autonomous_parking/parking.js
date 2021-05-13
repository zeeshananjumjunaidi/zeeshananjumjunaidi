class Parking {

    constructor(lVehicle, rVehicle, sideLine, vehicle) {
        this.lVehicle = lVehicle;
        this.rVehicle = rVehicle;
        this.vehicle = vehicle;
        this.sideLine = sideLine;
        this.centerPos = vehicle.position.copy();
    }


    draw() {
        
        fill(77);
        rect(0, this.centerPos.y, width * 2, 300);
        fill(33);
        rect(0, this.centerPos.y, width * 2, 100);
        // fill(200,200,20);
        fill(200,200,200);
        for(let i=0;i<width;i+=100){
        rect(i, this.centerPos.y, 50, 10);

        }

        // This points would be computed using 
        // computer vision, and sensor fusion.
        fill(255, 0, 0);
        let size = 5;
        let vP = this.vehicle.position;
        let rP = this.rVehicle.position;
        let lP = this.lVehicle.position;
        let vHeading = this.vehicle.heading;
        let rHeading = this.rVehicle.heading;
        let lHeading = this.lVehicle.heading;

        let points = this.boundingPoints(vHeading, vP);
        this.displayBoundingBox(points);
        let rPoints = this.boundingPoints(rHeading, rP);
        this.displayBoundingBox(rPoints);
        let lPoints = this.boundingPoints(lHeading, lP);
        this.displayBoundingBox(lPoints);

        circle(lP.x, lP.y, size);
        circle(rP.x, rP.y, size);
        circle(vP.x, vP.y, size);
        noFill();
        circle(vP.x, vP.y, vehicle.turningRadius / 2);
        circle(vP.x, vP.y, vehicle.turningRadius / 1.8);
        // line(0,this.centerPos.y-50,width,this.centerPos.y-50);
        // line(0,this.centerPos.y+50,width,this.centerPos.y+50);

    }

    displayBoundingBox(points) {
        line(points[0].x, points[0].y, points[1].x, points[1].y);
        line(points[2].x, points[2].y, points[3].x, points[3].y);

        line(points[0].x, points[0].y, points[2].x, points[2].y);
        line(points[1].x, points[1].y, points[3].x, points[3].y);
    }

    boundingPoints(heading, vP, scaleFactor = 50) {
        let PI0_3 = Math.PI * 0.2;
        let points = [];
        let ftrP = new p5.Vector(Math.cos(heading + PI0_3) * scaleFactor + vP.x, Math.sin(heading + PI0_3) * scaleFactor + vP.y);
        let ftlP = new p5.Vector(Math.cos(heading - PI0_3) * scaleFactor + vP.x, Math.sin(heading - PI0_3) * scaleFactor + vP.y);

        PI0_3 += Math.PI;
        let btrP = new p5.Vector(Math.cos(heading - PI0_3) * scaleFactor + vP.x, Math.sin(heading - PI0_3) * scaleFactor + vP.y);
        let btlP = new p5.Vector(Math.cos(heading + PI0_3) * scaleFactor + vP.x, Math.sin(heading + PI0_3) * scaleFactor + vP.y);
        points.push(ftrP, ftlP, btrP, btlP);
        return points;
    }
}