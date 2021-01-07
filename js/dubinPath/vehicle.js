/**
 * @author [Zeeshan Anjum Junaidi]
 * @email [zeeshananjumjunaidi@gmail.com]
 * @create date 2020-11-02 05:24:30
 * @modify date 2020-11-28 11:41:19
 * @desc [Dubin vehicle class]
 */


class Vehicle {
    // colorConfig = {
    //     innerTangentColor: color(255, 0, 0, 100),
    //     outerTangentColor: color(0, 255, 0, 100),
    //     middleCircleTangentColor: color(255, 255, 0, 100),
    // }
    constructor(x, y, heading, tx = 0, ty = 0, th = 0) {
        this.position = new THREE.Vector2(x, y);
        this.heading = heading;
        this.steerAngle = 0;
        this.constantVelocity = 1;
        this.autoPilot = false;
        this.alwaysSolve = false;
        this.debug = true;
        this.debugLevel = 4;
        //Target
        this.tPosition = new THREE.Vector2(tx, ty);
        this.tHeading = th;
        //Constant
        this.carWidth = 40;
        this.carHeight = 30;
        this.turningRadius = 100;
        this.turningRadiusRadian = (this.turningRadius) * Math.PI * 2;//@TODO: convert to RADIANS

      //  this.image = loadImage("../images/car2.png");
        this.vLCircle = new THREE.Vector2();
        this.vRCircle = new THREE.Vector2();
        this.tLCircle = new THREE.Vector2();
        this.tRCircle = new THREE.Vector2();

        this.mCircleDistance = this.turningRadius * 2;
        this.isCCCValid = false;
        this.dubinMath = new DubinMath(this.turningRadius);
        this.pathDataList = [];
        this.drivingPathCoordinates = [];
        /// Helper classes 
       // this.vehicleDebugger = new VehicleDebugger(this, true);
       // this.steerController = new PIDController(0.1, 0.0001, 4);
      //  this.accelerationController = new PIDController(0.6, 0, 0);
        this._driveHeading = this.heading;
        this.addSensors();
      //  this.environment = undefined;
    }
    setEnvironment(environment) {
      //  this.environment = environment;
    }
    addSensors() {
       // this.lidar = new Lidar(this);
    }
    toggleAlwaysSolve() {
        this.alwaysSolve = !this.alwaysSolve;
    }
    // Control and Update
    drive(power, steerAngle) {
        // if(this.lidar)
        // this.lidar.scan();
        // if (this.environment) {
        //     this.environment.show();
        // }
        if (this.autoPilot) {
            this.autoDrive();
            return;
        }
        if (this.alwaysSolve) {
            this.solvePath();
        }
        this.manualDrive(steerAngle, power);
    }
    currentPosIndex = 0;

    autoDrive() {
        if (this.drivingPathCoordinates.length > 0 && this.currentPosIndex < this.drivingPathCoordinates.length) {
            let dpC = this.drivingPathCoordinates[this.currentPosIndex];
            let dx = dpC.x - this.position.x;
            let dy = dpC.y - this.position.y;
            let angle = Math.atan2(dy, dx);
            let dist = vectorDist(dpC, this.position);
            if (dist > 0.2) {
                let vc = new THREE.Vector2();
                vc.x = dpC.x - Math.cos(angle) * 0.1;
                vc.y = dpC.y - Math.sin(angle) * 0.1;
                this.heading = angle;
                this.position = vc;
                // this.drive
                // this.manualDrive(angle>0?1:angle<0?-1:0,vc.normalize().mag());
            } else {
                this.currentPosIndex++;
            }
        }
    }
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

        this.vLCircle = this.getLCircle(this.position, this.heading, radius);
        this.vRCircle = this.getRCircle(this.position, this.heading, radius);
    }

    getLCircle(position, heading, vectorLength) {
        let eLPx = position.x + Math.sin(heading) * vectorLength;
        let eLPy = position.y + Math.sin(heading - Math.PI / 2) * vectorLength;
        return new THREE.Vector2(eLPx, eLPy);
    }
    getRCircle(position, heading, vectorLength) {
        let eRPx = position.x + Math.sin(heading) * -vectorLength;
        let eRPy = position.y + Math.sin(heading - Math.PI / 2) * -vectorLength;
        return new THREE.Vector2(eRPx, eRPy);
    }
    // Drawing
    draw() {
        // rectMode(CENTER);
        // this.drawVehicle();
        // this.drawTarget();
        // this.vehicleDebugger.draw();
        this.simulateDubinPath();
        // this.drawDrivingPath();
    }
    /**
     * Draw Vehicle UI
     */
    drawVehicle() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.heading);
        noFill();
     //   image(this.image, 0, 0, this.carWidth, this.carHeight);
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
    //    image(this.image, 0, 0, this.carWidth, this.carHeight);
        pop();
    }

    /**
     * Toggle debug
     */
    toggleDebug() {
        this.debug = !this.debug;
      //  this.vehicleDebugger.toggleDebug();
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
        // this.tHeading = this.tHeading % (PI * 2);
        this.tLCircle = this.getLCircle(this.tPosition, this.tHeading, this.turningRadius / 2);
        this.tRCircle = this.getRCircle(this.tPosition, this.tHeading, this.turningRadius / 2);
    }

    /**
     * Simulate Dubin Paths.
     * This function will calculate all dubin paths.
     */
    simulateDubinPath() {
        this.calculateAllPaths();
    }

    calculateAllPaths() {
        // Clear all previous paths
        this.pathDataList = [];
        // We need to calculate 6 paths as follow
        // LSL, RSR, LSR, RSL, RLR, LRL
        let comparisonSqr = this.turningRadius * 2;

        // LSL # 1
        if (this.vLCircle.x != this.tLCircle.x && this.vLCircle.y != this.tLCircle.y) {
            this.updateLSL();
        }
        // RSR # 2
        if (this.vRCircle.x != this.tRCircle.x && this.vRCircle.y != this.tRCircle.y) {
            this.updateRSR();
        }
        // LSR # 3
        if (p5.Vector.sub(this.vLCircle, this.tRCircle).mag() > comparisonSqr) {
            this.updateLSR();
        }
        // RSL # 4
        if (p5.Vector.sub(this.vRCircle, this.tLCircle).mag() > comparisonSqr) {
            this.updateRSL();
        }
        // RLR # 5
        if (p5.Vector.sub(this.vRCircle, this.tRCircle).mag() < comparisonSqr) {
            this.updateRLR();
        }
        //LRL # 6
        if (p5.Vector.sub(this.vLCircle, this.tLCircle).mag() < comparisonSqr) {
            this.updateLRL();
        }
        // Reed Shepp Paths paths
        // currently we are considering all types of paht one by one.
       
        // For live path preview enable this.        
        //this.drivingPathCoordinates=[];
        //this.generateDrivingPath();
    }
    solvePath() {
        if (!this.alwaysSolve)
            print('solving paths');
        this.drivingPathCoordinates = [];
        this.currentPosIndex = 0;
        this.generateDrivingPath();
    }
    generateDrivingPath() {
        if (this.pathDataList.length > 0) {
            //Sort the list with paths so the shortest path is first
            this.pathDataList = this.pathDataList.sort((x, y) => { return x.totalLength - y.totalLength; });
            // calculate final path coordinate from the 1st index of path array as it is the shortest path.
            let path = this.pathDataList[0];
            let driveDistance = 0.05;
            let theta = this.heading;
            let currentPosition = new THREE.Vector2(this.position.x, this.position.y);

            this.drivingPathCoordinates.push({ x: currentPosition.x, y: currentPosition.y, heading: this.heading, segmentIndex: 1 });
            // 1st Segment
            let segments = Math.abs(Math.floor(path.length1 / driveDistance));
            theta = this.generatePathCoordinates(segments, currentPosition, driveDistance, theta, true, path.segment1TurningRight, 1);
            // 2nd Segment
            segments = Math.abs(Math.floor(path.length2 / driveDistance));
            theta = this.generatePathCoordinates(segments, currentPosition, driveDistance, theta, path.segment2Turning, path.segment2TurningRight, 2);;
            // 3rd Segment
            segments = Math.abs(Math.floor(path.length3 / driveDistance));
            theta = this.generatePathCoordinates(segments, currentPosition, driveDistance, theta, true, path.segment3TurningRight, 3);;

            this.drivingPathCoordinates.push({ x: this.tPosition.x, y: this.tPosition.y, segmentIndex: 3 });
        }
    }

    generatePathCoordinates(segments, currentPosition, driveDistance, theta, isTurning, isTurningRight, index = 0) {
        let turningRadiusInRadian = this.turningRadius / 2;
        for (let i = 0; i < segments; i++) {
            currentPosition.x += driveDistance * Math.cos(theta);
            currentPosition.y += driveDistance * Math.sin(theta);
            if (isTurning) {
                let turnParameter = -1;
                if (isTurningRight) {
                    turnParameter = 1;
                }
                theta += (driveDistance / turningRadiusInRadian) * turnParameter; //(driveDistance/this.turningRadius)*turnParameter;
            }

            if (i % 50 == 0) {
                // // Live Path visualization
                // strokeWeight(2);
                // if (index == 1) { stroke(255, 0, 255); }
                // else if (index == 2) { stroke(50, 175, 150); }
                // else { stroke(0, 0, 255); }
                // point(currentPosition.x, currentPosition.y);            
                this.drivingPathCoordinates.push(
                    { x: currentPosition.x, y: currentPosition.y, segmentIndex: index });
            }
        }
        return theta;
    }
    updateLSL() {
        let result = this.dubinMath.GetLSLorRSRTangent(this.vLCircle, this.tLCircle, false);
      //  this.vehicleDebugger.displayTangents(result, this.colorConfig.outerTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vLCircle, this.position, result.startTangent, true);
        let l2 = vectorDist(result.startTangent, result.endTangent);
        let l3 = this.dubinMath.getArcLength(this.tLCircle, result.endTangent, this.tPosition, true);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.LSL);
        pathData.segment2Turning = false;
        pathData.SetIfTurningRight(false, false, false);
        this.pathDataList.push(pathData);
    }

    updateRSR() {
        let result = this.dubinMath.GetLSLorRSRTangent(this.vRCircle, this.tRCircle, true);
       // this.vehicleDebugger.displayTangents(result, this.colorConfig.outerTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vRCircle, this.position, result.startTangent, false);
        let l2 = vectorDist(result.startTangent, result.endTangent);
        let l3 = this.dubinMath.getArcLength(this.tRCircle, result.endTangent, this.tPosition, false);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.RSR);
        pathData.segment2Turning = false;
        pathData.SetIfTurningRight(true, false, true);
        this.pathDataList.push(pathData);
    }
    updateLSR() {
        let result = this.dubinMath.GetLSRorRSLTangent(this.vLCircle, this.tRCircle, false);
      //  this.vehicleDebugger.displayTangents(result, this.colorConfig.innerTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vLCircle, this.position, result.startTangent, true);
        // print(l1);
        let l2 = vectorDist(result.startTangent, result.endTangent);
        let l3 = this.dubinMath.getArcLength(this.tRCircle, result.endTangent, this.tPosition, false);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.LSR);
        pathData.segment2Turning = false;
        pathData.SetIfTurningRight(false, false, true);
        this.pathDataList.push(pathData);
    }
    updateRSL() {
        let result = this.dubinMath.GetLSRorRSLTangent(this.vRCircle, this.tLCircle, true);
      //  this.vehicleDebugger.displayTangents(result, this.colorConfig.innerTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vRCircle, this.position, result.startTangent, false);
        let l2 = vectorDist(result.startTangent, result.endTangent);
        let l3 = this.dubinMath.getArcLength(this.tLCircle, result.endTangent, this.tPosition, true);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.RSL);
        pathData.segment2Turning = false;
        pathData.SetIfTurningRight(true, false, false);
        this.pathDataList.push(pathData);
    }
    updateRLR() {
        let result = this.dubinMath.getRLRorLRLTangentPointsAndMiddleCircle(this.vRCircle, this.tRCircle, false);
      //  this.vehicleDebugger.displayTangents(result, this.colorConfig.middleCircleTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vRCircle, this.position, result.middleCircle, false, 1);
        let l2 = this.dubinMath.getArcLength(result.middleCircle, result.endTangent, result.startTangent, true, 2);
        let l3 = this.dubinMath.getArcLength(this.tRCircle, result.startTangent, this.tPosition, false, 3);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.RLR);
        pathData.segment2Turning = true;
        pathData.SetIfTurningRight(true, false, true);
        this.pathDataList.push(pathData);
    }
    updateLRL() {
        let result = this.dubinMath.getRLRorLRLTangentPointsAndMiddleCircle(this.vLCircle, this.tLCircle, true);
       // this.vehicleDebugger.displayTangents(result, this.colorConfig.middleCircleTangentColor);

        let l1 = this.dubinMath.getArcLength(this.vLCircle, this.position, result.middleCircle, true, 1);
        let l2 = this.dubinMath.getArcLength(result.middleCircle, result.endTangent, result.startTangent, false, 2);
        let l3 = this.dubinMath.getArcLength(this.tLCircle, result.startTangent, this.tPosition, true, 3);
        let pathData = new DubinPath(l1, l2, l3, result.startTangent, result.endTangent, PathType.LRL);
        pathData.segment2Turning = true;
        pathData.SetIfTurningRight(false, true, false);
        this.pathDataList.push(pathData);
    }
}