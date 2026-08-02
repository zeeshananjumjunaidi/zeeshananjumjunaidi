const PathType = Object.freeze({
    LRL: "LRL", RLR: "RLR", LSR: "LSR",
    RSL: "RSL", RSR: "RSR", LSL: "LSL",
    LnRL:"LnRL",RnLR:"RnLR",LSnR:"LSnR",
    LnSR:"LnSR",nLSR:"nLSR",nLSnR:"nLSnR"
})
class DubinPath {
    constructor(length1, length2, length3, tangent1, tangent2, pathType) {
        this.length1 = length1;
        this.length2 = length2;
        this.length3 = length3;
        this.totalLength = length1 + length2 + length3;
        this.tangent1 = tangent1;
        this.tangent2 = tangent2;
        this.pathType = pathType;
        this.segment1TurningRight = false;
        this.segment2TurningRight = false;
        this.segment3TurningRight = false;
        this.pathCoordinates = [];
        //To simplify when we generate the final path coordinates
        //Are we turning or driving straight in segment 2?
        this.segment2Turning = false;
        this.name = pathType.toString();
    }
    //Are we turning right in any of the segments?
    SetIfTurningRight(
        segment1TurningRight,
        segment2TurningRight,
        segment3TurningRight) {
        this.segment1TurningRight = segment1TurningRight;
        this.segment2TurningRight = segment2TurningRight;
        this.segment3TurningRight = segment3TurningRight;
    }
}