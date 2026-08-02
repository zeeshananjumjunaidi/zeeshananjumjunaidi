class DubinMath {
    constructor(turningRadius = 100) {
        this.turningRadius = turningRadius / 2;
    }

    //Outer tangent (LSL and RSR)
    GetLSLorRSRTangent(startCircle, goalCircle, isBottom) {
        //The angle to the first tangent coordinate is always 90 degrees if the both circles have the same radius
        let theta = Math.PI / 2;//1.5708;//90;// 1.5708;//90 * 0.0174533;

        //Need to modify theta if the circles are not on the same height (z)
        theta += Math.atan2(goalCircle.y - startCircle.y,
            goalCircle.x - startCircle.x);

        //Add pi to get the "bottom" coordinate which is on the opposite side (180 degrees = pi)
        if (isBottom) {
            theta += Math.PI;
        }

        //The coordinates of the first tangent points
        let xT1 = startCircle.x + this.turningRadius * Math.cos(theta);
        let yT1 = startCircle.y + this.turningRadius * Math.sin(theta);

        //To get the second coordinate we need a direction
        //This direction is the same as the direction between the center pos of the circles
        let dirVec = p5.Vector.sub(goalCircle, startCircle);
        let xT2 = xT1 + dirVec.x;
        let yT2 = yT1 + dirVec.y;

        //The final coordinates of the tangent lines
        let startTangent = createVector(xT1, yT1);
        let endTangent = createVector(xT2, yT2);

        return { startTangent: startTangent, endTangent: endTangent };
    }
    //Special thanks to Habrador for clear explaination of calculating tangents.
    // https://www.habrador.com/tutorials/unity-dubins-paths/2-basic-dubins-paths/
    //Inner tangent (RSL and LSR)
    GetLSRorRSLTangent(startCircle, goalCircle, isBottom) {
        //Find the distance between the circles
        let D = p5.Vector.sub(startCircle, goalCircle).mag();


        //If the circles have the same radius we can use cosine and not the law of cosines 
        //to calculate the angle to the first tangent coordinate 
        let theta = Math.acos(2 * this.turningRadius / D);
        //If the circles is LSR, then the first tangent pos is on the other side of the center line
        if (isBottom) {
            theta *= -1;
        }

        //Need to modify theta if the circles are not on the same height            
        theta += Math.atan2(goalCircle.y - startCircle.y, goalCircle.x - startCircle.x);

        //The coordinates of the first tangent point
        let xT1 = startCircle.x + this.turningRadius * Math.cos(theta);
        let yT1 = startCircle.y + this.turningRadius * Math.sin(theta);

        //To get the second tangent coordinate we need the direction of the tangent
        //To get the direction we move up 2 circle radius and end up at this coordinate
        let xT1_tmp = startCircle.x + 2 * this.turningRadius * Math.cos(theta);
        let yT1_tmp = startCircle.y + 2 * this.turningRadius * Math.sin(theta);

        //The direction is between the new coordinate and the center of the target circle
        let dirVec = p5.Vector.sub(goalCircle, createVector(xT1_tmp, yT1_tmp));
        // drawLine(goalCircle,dirVec.mult(2),color(0,255,0));
        //The coordinates of the second tangent point is the 
        let xT2 = xT1 + dirVec.x;
        let yT2 = yT1 + dirVec.y;

        //The final coordinates of the tangent lines
        let startTangent = createVector(xT1, yT1);
        let endTangent = createVector(xT2, yT2);
        return { startTangent: startTangent, endTangent: endTangent };
    }
    /**
     * Get 3 circles tangents
     * @param {Vector} startCircle 
     * @param {Vector} goalCircle 
     * @param {boolean} isLRL 
     */
    getRLRorLRLTangentPointsAndMiddleCircle(startCircle, goalCircle, isLRL) {

        //The distance between the circles
        let D = p5.Vector.sub(startCircle, goalCircle).mag();

        //The angle between the goal and the new 3rd circle we create with the law of cosines
        let theta = Math.acos(D / (4 * this.turningRadius));
        //But we need to modify the angle theta if the circles are not on the same line
        let V1 = p5.Vector.sub(goalCircle, startCircle);
        //Different depending on if we calculate LRL or RLR
        if (isLRL) {
            theta = Math.atan2(V1.y, V1.x) + theta;
        }
        else {
            theta = Math.atan2(V1.y, V1.x) - theta;
        }

        //Calculate the position of the third circle
        let x = startCircle.x + 2 * this.turningRadius * Math.cos(theta);
        let y = startCircle.y + 2 * this.turningRadius * Math.sin(theta);

        let middleCircle = createVector(x, y);
        //Calculate the tangent points
        let V2 = p5.Vector.sub(goalCircle, middleCircle).normalize().mult(50);
        let V3 = p5.Vector.sub(startCircle, middleCircle).normalize().mult(50);
        let startTangent = p5.Vector.add(middleCircle, V2);//.mult(50);//.mult(50);
        let endTangent = p5.Vector.add(middleCircle, V3);//.mult(50);//.mult(50);
        return { startTangent: startTangent, endTangent: endTangent, middleCircle: middleCircle };
    }

    getArcLength(circleCenterPos,
        startPos,
        goalPos,
        isLeftCircle,segmentNumber=1) {
        // https://arxiv.org/pdf/1804.07238.pdf
        noFill();
        let radius = 50;
        let startAngle = Math.atan2(startPos.y - circleCenterPos.y, startPos.x - circleCenterPos.x);
        let goalAngle = Math.atan2(goalPos.y - circleCenterPos.y, goalPos.x - circleCenterPos.x);
        // if(segmentNumber==3){
        //     strokeWeight(2);
        //     drawLine(startPos,circleCenterPos);
        //     drawLine(goalPos,circleCenterPos);
        //     arc(circleCenterPos.x,circleCenterPos.y,80,80,startAngle,goalAngle);
        //     strokeWeight(1);
        // }
        // drawCircle(circleCenterPos,10);
        // drawCircle(startPos,10);
        // drawCircle(goalPos,10);

        let theta = (startAngle - goalAngle);
        if (theta < 0 && isLeftCircle) {
            theta -= 2 * Math.PI;
         //   drawLine(circleCenterPos, startPos);
         //   drawLine(circleCenterPos, goalPos);
        }        
        else if (theta > 0 && !isLeftCircle) {
            theta += 2 * Math.PI;
          //  drawLine(circleCenterPos, startPos);
         //   drawLine(circleCenterPos, goalPos);
        }
        theta = theta % (Math.PI*2);
        if(isLeftCircle){
            theta = 2*Math.PI + theta;
        }else{
            
            theta = 2*Math.PI - theta;
        }
        theta = theta % (Math.PI*2);

        // if (!isLeftCircle) {
        //     arc(circleCenterPos.x, circleCenterPos.y, 30, 30, (startAngle), (goalAngle));
        // } else {
        //     arc(circleCenterPos.x, circleCenterPos.y, 30, 30, (goalAngle), (startAngle));
        // }
        noStroke();
        fill(255);
        //text((theta).toFixed(2), circleCenterPos.x, circleCenterPos.y + 10);
        //text(((theta * 180 / Math.PI*2)%360).toFixed(2), circleCenterPos.x, circleCenterPos.y + 20);


        stroke(255);
        noFill();
        let length = Math.abs(radius * theta);
        return length;
    }
   
}