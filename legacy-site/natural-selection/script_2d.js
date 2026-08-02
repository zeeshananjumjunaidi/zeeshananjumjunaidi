

var height = window.innerHeight;
var width = window.innerWidth;
var agents = [];
var predators = [];
function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width, height);

    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    for (let i = 0; i < 100; i++) {
        let agent = new Kinematic2DObject(random(0, width), random(0, height), agents, i, 5, 5);
        agents.push(agent);
    }
    for (let i = 0; i < 10; i++) {
        let predator = new Kinematic2DObject(random(0, width), random(0, height), predators, i, 5, 5, 5, true);
        predators.push(predator);
        predators[i].addPrey(agents);
    }

}


function draw() {

    // background(0x2e3d49);
    background('#EEEEEE');
    // background(0)
    push();
    for (let i = 0; i < agents.length; i++) {
        let agent = agents[i];
        agent.autoFollow();
        // agent.follow(mouseX,mouseY);
        agent.update();
    } for (let i = 0; i < predators.length; i++) {
        let predator = predators[i];
        predator.autoFollow();
        // agent.follow(mouseX,mouseY);
        predator.update();
    }
    pop();
}
