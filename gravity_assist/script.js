
// Gravity Assit / Slingshot / Oberth maneuver
// Paper reference: http://symbolaris.com/course/fcps16/projects/amoran.pdf
// We 'll implement simulation of powered and unpowered gravity assits
// Currently we are ignoring spacecraft interaction with each other, as it is insignificant.
var gravitySource;
var spacecraft;
var sc2;
var width;
var height;
var isPause = false;
var statsElement;
var spacecrafts = [];
function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);
    rectMode(CENTER)
    frameRate(60);
    gravitySource = new GravitySource(width * 0.25, 0, 110000, 100);
    spacecraft = new Spacecraft(-width / 2.5, 0, 100, 20, 0, 1.1);
    // sc2 = new Spacecraft(width*0.25-500,-200,100,20,-5,-2);
    $('#playBtn').click(() => {
        console.log(this.isPause)
        this.isPause = !this.isPause;
        if (this.isPause) { $('#playBtn')[0].innerHTML = '<i class="fas fa-pause"></i>' } else {
            $('#playBtn')[0].innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    statsElement = $('#stats');
}
let currentSpaceCraft;
function mouseReleased() {
    if (currentSpaceCraft) {
        print('mouse released')
        spacecrafts.push(currentSpaceCraft);
        currentSpaceCraft = undefined;
    }
}

function mousePressed() {
    print('mouse pressed')
    currentSpaceCraft = new Spacecraft(mouseX, mouseY, 100, 20, 0, 1.1);
}
function draw() {
    translate(width / 2, height / 2);
    background(255);
    noStroke();
    fill(0);
    gravitySource.draw();
    spacecraft.draw();
    if (currentSpaceCraft) { currentSpaceCraft.draw();
        currentSpaceCraft.x = mouseX - width / 2; currentSpaceCraft.y = mouseY - height / 2 }
    if (spacecrafts != null && spacecrafts.length > 0) {
        for (let i = 0; i < spacecrafts.length; i++) {
            spacecrafts[i].draw();
        }
    }
    // sc2.draw();
    if (!isPause) {
        spacecraft.simulate(gravitySource);
        // sc2.simulate(gravitySource);
    } else {
        spacecraft.drawSimulationPath(gravitySource);
        // sc2.drawSimulationPath(gravitySource);
    }
    // if(statsElement){
    //     statsElement.text(`VELOCITY: ${sc2.vel.x.toFixed(2)},${sc2.vel.y.toFixed(2)}`)
    // }    
    // let vOPG = getEscapeVelocity(dist(sc2.x,sc2.y,gravitySource.x,gravitySource.y),gravitySource.mass);
    // We have to introduce some constant to balance the overall simulation because the ratio of 
    // mass b/w spacecraft and planet is not accurate.
    // sc2.vel.x+=vOPG;
    // sc2.vel.y+=vOPG;
    // text(vOPG.toFixed(2),0,100);
}