function drawCircle(v1,radius){

    circle(v1.x,v1.y,radius);
}
function drawLine(v1,v2,color=undefined){
    if(color){
        stroke(color);
    }    
    line(v1.x,v1.y,v2.x,v2.y);
}