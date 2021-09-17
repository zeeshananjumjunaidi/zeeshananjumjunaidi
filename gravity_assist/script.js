
// Gravity Assit / Slingshot / Oberth maneuver
// Paper reference: http://symbolaris.com/course/fcps16/projects/amoran.pdf
// We 'll implement simulation of powered and unpowered gravity assits

var gravitySource;
var spacecraft;
var width;
var height;
var isPause = false;
function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    rectMode(CENTER)

    gravitySource = new GravitySource(0, 0, 11000, 100);
    spacecraft = new Spacecraft(-width / 2.5, 0, 100, 20);
    $('#playBtn').click(()=> {
        console.log(this.isPause)
        this.isPause = !this.isPause;
        if (this.isPause) { $('#playBtn')[0].innerHTML = '<i class="fas fa-pause"></i>' } else {
            $('#playBtn')[0].innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

function draw() {
    translate(width / 2, height / 2);
    background(255);
    noStroke();
    fill(0);
    gravitySource.draw();
    spacecraft.draw();
    if(!isPause){
        spacecraft.simulate(gravitySource);
    }
}