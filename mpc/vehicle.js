/**
 * @author [Zeeshan Anjum Junaidi]
 * @email [zeeshananjumjunaidi@gmail.com]
 * @create date 2020-11-02 05:24:30
 * @modify date 2020-11-28 11:41:19
 * @desc [Dubin vehicle class]
 */


class Vehicle {
    colorConfig = {
        innerTangentColor: color(255, 0, 0, 100),
        outerTangentColor: color(0, 255, 0, 100),
        middleCircleTangentColor: color(255, 255, 0, 100),
    }
    constructor(x, y, heading, tx = 0, ty = 0, th = 0) {
        this.position = createVector(x, y);
        this.heading = heading;
        this.steerAngle = 0;
        this.constantVelocity = 1;
        this.autoPilot = false;
        this.alwaysSolve = false;
        this.debug = true;
        this.debugLevel = 4;
        //Target
        this.tPosition = createVector(tx, ty);
        this.tHeading = th;
        //Constant
        this.carWidth = 40;
        this.carHeight = 30;
        this.turningRadius = 100;
        this.turningRadiusRadian = radians(this.turningRadius) * Math.PI * 2;

        this.image = loadImage("car2.png");

        this.mCircleDistance = this.turningRadius * 2;
    }
    setEnvironment(environment) {
        this.environment = environment;
    }
    addSensors() {
        this.lidar = new Lidar(this);
    }
    toggleAlwaysSolve() {
        this.alwaysSolve = !this.alwaysSolve;
    }
    // Control and Update
    drive(power, steerAngle) {

        this.manualDrive(steerAngle, power);
    }
    currentPosIndex = 0;


    manualDrive(steerAngle, power) {
        this.updatePositionAndHeading(steerAngle, power);
    }

    updatePositionAndHeading(steerAngle, power) {
        let radius = this.turningRadius / 2;
        this.steerAngle = steerAngle;
        this.constantVelocity = power; //constant velocity
        this.heading += (this.steerAngle * this.constantVelocity) / radius;
        this.position.x += this.constantVelocity * Math.cos(this.heading);
        this.position.y += this.constantVelocity * Math.sin(this.heading);
    }

    // Drawing
    draw() {
        // rectMode(CENTER);
        this.drawVehicle();
        this.drawTarget();
    }
    /**
     * Draw Vehicle UI
     */
    drawVehicle() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        noFill();
        image(this.image, 0, 0, this.carWidth, this.carHeight);
        pop();
    }
    /**
     * Draw Target UI
     */
    drawTarget() {
        push();
        translate(this.tPosition.x, this.tPosition.y);
        rotate(this.tHeading);
        noFill();
        tint(255, 100);
        image(this.image, 0, 0, this.carWidth, this.carHeight);
        pop();
    }


    toggleAutoPilot() {
        this.autoPilot = !this.autoPilot;
    }

    /**
     * Update Target Control
     * @param {Vector} position 
     * @param {Number} heading 
     */
    updateTargetControl(position, heading) {
        this.tPosition.x += position.x;
        this.tPosition.y += position.y;
        this.tHeading += heading / (this.turningRadius / 2);
    }
}