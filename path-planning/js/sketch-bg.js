
function drawBackground(halfWidth,halfHeight) {
    
    textSize(9);
    stroke(255, 10);
    strokeWeight(1);
    fill(255, 10);
    line(-halfWidth, 0, halfWidth, 0);
    line(0, -halfHeight, 0, halfHeight);
    for (let i = -halfWidth + 10; i < halfWidth; i += 10) {
        line(i, -5, i, 5);
        if (i % 80 == 0) {
            circle(i, 0, 5);
        }
        if(i%40==0&&i!=0){
            text(i,i,-10);
        }
    }
    for (let i = -halfHeight + 10; i < halfHeight; i += 10) {
        line(-5, i, 5, i);
        if (i % 80 == 0) {
            circle(0, i, 5);
        }
        if(i%40==0){
            text(i,10,i);
        }
    }
    circle(0, 0, 5);
    noFill();
    circle(0, 0, 15);
}