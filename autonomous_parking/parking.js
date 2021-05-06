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
        let tP = new p5.Vector(Math.cos(vHeading)*scaleFactor+vP.x,Math.sin(vHeading)*scaleFactor+vP.y);
        circle(tP.x,tP.y,size*2);

        circle(lP.x,lP.y,size);
        circle(rP.x,rP.y,size);
        circle(vP.x,vP.y,size);
        noFill();
        circle(vP.x,vP.y,vehicle.turningRadius/2);

    }
}