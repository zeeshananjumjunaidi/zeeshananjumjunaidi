/**
 * @author [Zeeshan Anjum Junaidi]
 * @email [zeeshananjumjunaidi@gmail.com]
 * @create date 2020-11-02 05:24:30
 * @modify date 2020-11-28 11:41:19
 * @desc [Vehicle Debugger to show Debug UI]
 */

class VehicleDebugger {

    constructor(vehicle, enabled = true) {
        this.vehicle = vehicle;
        this.enabled = enabled;
        this.nextX = -width / 2 + 10;
        this.nextY = -height / 2 + 50;
    }
    enableDebug() {
        this.enabled = true;
    }
    disableDebug() {
        this.enabled = false;
    }
    toggleDebug() {
        this.enabled = !this.enabled;
    }

    draw() {
        this.drawDrivingPath();
        if (!this.enabled) return;
        line(this.nextX - 10, this.nextY, this.nextX + width, this.nextY);
        this.debugInfo();
        this.drawLRCircles();
        this.debugPaths();
    }

    debugInfo() {

        noStroke();
        fill(0, 255, 200, 150); // Draw Vehicle Properties
        textSize(12);
        let drivingMode = this.vehicle.autoPilot ? 'Auto' : 'Manual';
        let dmTxt = `Driving Mode: ${drivingMode}`;
        let dmTxtSize = textWidth(dmTxt);
        text(dmTxt, -dmTxtSize / 2, -height / 2 + 20);

        text('Vehicle 🚗', this.nextX, this.nextY - 5);
        textSize(9);
        fill(255, 150);
        text(`Position: ${this.vehicle.position.x.toFixed(2)}, ${this.vehicle.position.y.toFixed(2)}`, this.nextX, this.nextY + 10);
        text(`Heading: ${this.vehicle.heading.toFixed(2)}`, this.nextX, this.nextY + 20);

        fill(255, 50, 50, 150);
        textSize(12);
        let rightOffset = 150;
        text('Target 🚗', this.nextX + width - rightOffset, this.nextY - 5);
        textSize(9);
        fill(255, 150);
        text(`Position: ${this.vehicle.tPosition.x.toFixed(2)}, ${this.vehicle.tPosition.y.toFixed(2)}`, this.nextX + width - rightOffset, this.nextY + 10);
        text(`Heading: ${this.vehicle.tHeading.toFixed(2)}`, this.nextX + width - rightOffset, this.nextY + 20);
    }

    drawLRCircles(isLeft, isTarget) {
        noFill();
        stroke(255, 50);
        drawCircle(this.vehicle.tLCircle, this.vehicle.turningRadius, undefined, true);
        drawCircle(this.vehicle.tRCircle, this.vehicle.turningRadius, undefined, true);
        drawCircle(this.vehicle.vLCircle, this.vehicle.turningRadius, undefined, true);
        drawCircle(this.vehicle.vRCircle, this.vehicle.turningRadius, undefined, true);
        let centerAngle = isTarget ? this.vehicle.heading : this.vehicle.tHeading;
        centerAngle = isLeft ? centerAngle + Math.PI / 2 : centerAngle;
        // this.newMethod(centerAngle);

        textSize(9);
        this.drawTicksAndLabel('L', this.vehicle.tHeading + Math.PI / 2, this.vehicle.tLCircle);
        this.drawTicksAndLabel('R', this.vehicle.tHeading - Math.PI / 2, this.vehicle.tRCircle);
        this.drawTicksAndLabel('L', this.vehicle.heading + Math.PI / 2, this.vehicle.vLCircle);
        this.drawTicksAndLabel('R', this.vehicle.heading - Math.PI / 2, this.vehicle.vRCircle);
    }
    drawTicksAndLabel(name, centerAngle, origin) {
        text(name, origin.x, origin.y);
        // for (let i = 0; i < Math.PI * 2; i += 0.4) {
        //     let x = Math.cos(centerAngle + i) * 50;
        //     let y = Math.sin(centerAngle + i) * 50;
        //     let x1 = Math.cos(centerAngle + i) * 40;
        //     let y1 = Math.sin(centerAngle + i) * 40;
        //     if (i == 0) { x1 *= 0.5; y1 *= 0.5; }
        //     stroke(50, 100);
        //     line(origin.x + x, origin.y + y, origin.x + x1, origin.y + y1);
        //     noStroke();
        //     fill(255, 100);
        //     textSize(7);
        //     let txt = (i * 180 / Math.PI).toFixed();
        //     let tsize = textSize(txt) / 2;
        //     text(txt, origin.x + x1 - tsize, origin.y + y1 + 3.5);
        // }
    }

    displayTangents(result, sColor = undefined) {
        noFill();
        if (!this.enabled) return;
        if (sColor) {
            stroke(sColor);
        }
        if (result.startTangent && result.endTangent && !result.middleCircle) {
            drawLine(result.startTangent, result.endTangent);
            fill(sColor);
            drawCircle(result.startTangent, 5);
            drawCircle(result.endTangent, 5);
        }
        if (result.middleCircle) {
            drawCircle(result.middleCircle, this.vehicle.turningRadius);
            if (sColor) {
                fill(sColor);
            }
            drawCircle(result.startTangent, 5);
            drawCircle(result.endTangent, 5);

        }
    }
    debugPaths() {
        if (this.vehicle.pathDataList.length > 0) {

            noStroke();
            let yOffset = 35;
            for (let i = 0; i < this.vehicle.pathDataList.length; i++) {
                if (i == 0) { fill(255, 0, 0); }
                else {
                    fill(255, 150);
                }
                let path = this.vehicle.pathDataList[i];
                let msg = '';
                msg += path.name;
                msg += '\t L1: ' + path.length1.toFixed(2);
                msg += '\t L2: ' + path.length2.toFixed(2);
                msg += '\t L3: ' + path.length3.toFixed(2);
                msg += '\t Total Length: ' + path.totalLength.toFixed(2);
                text(msg, this.nextX, this.nextY + yOffset);
                yOffset += 10;
            }
        }
    }
    drawDrivingPath() {
        if (this.vehicle.drivingPathCoordinates.length > 0) {
            strokeWeight(1);
            noFill();
            let heading = 10;
            let pos = this.vehicle.position;
            let frame_id = 1;
            for (let i = 0; i < this.vehicle.drivingPathCoordinates.length; i++) {
                let p = this.vehicle.drivingPathCoordinates[i];
                if (p.segmentIndex == 1) {
                    stroke(0, 255, 0, 50);
                } else if (p.segmentIndex == 2) {
                    stroke(0, 255, 255, 50);
                } else {
                    stroke(255, 255, 0, 50);
                }
                if (i % 10 == 0 || i == this.vehicle.drivingPathCoordinates.length - 1 || i == 0) {
                    if (i == 0 && (!this.vehicle.alwaysSolve || this.vehicle.autoPilot)) { continue; }
                    push();
                    translate(pos);
                    rotate(p.heading != undefined ? p.heading : heading);
                    rect(0, 0, 50, 30, 2);
                    text(frame_id++, 0, -6);
                    pop();
                }
                heading = Math.atan2(p.y - pos.y, p.x - pos.x);
                pos = createVector(p.x, p.y);
                // point(p.x,p.y);
            }
        }
    }
}