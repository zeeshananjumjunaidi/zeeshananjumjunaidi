function rotatePoint(cx, cy, angle, centerPoint) {
    let p = createVector(centerPoint.x, centerPoint.y);
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    // translate point back to origin:
    p.x -= cx;
    p.y -= cy;

    // rotate point
    let xnew = p.x * c - p.y * s;
    let ynew = p.x * s + p.y * c;

    // translate point back:
    p.x = xnew + cx;
    p.y = ynew + cy;
    return p;
}
function vectorDist(a,b){
    return dist(a.x,a.y,b.x,b.y);
}