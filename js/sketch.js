
let img;

function setup(){
    print(innerWidth,innerHeight);
    createCanvas(innerWidth,innerHeight,WEBGL);
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER);
}
// start loading images
function preload()
{
  // image texture from http://planetpixelemporium.com/
  img = loadImage('assets/img/earth.diffuse.2k.jpg');
}
function draw(){
    noCursor();
    // translate(width/2,height/2);
    background(15,20,20);
    //  rect(0,0,width-100,height-150);

     // earth image
  noStroke();
  texture(img);
  
  // allow user to drag, zoom, and move globe
  orbitControl();
  
  //earth's rotation
  rotateY(millis() / 10000);
  
  //earth
  sphere(200);
}