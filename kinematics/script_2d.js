

var height = window.innerHeight;
var width = window.innerWidth;
var roboticHand;
function setup(){    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    roboticHand= new Kinematic2DObject(random(0,width),random(0,height),1,200,3);
    
}


function draw(){
    
    // background(0x2e3d49);
    background('#EEEEEE');
    // background(0)
    push();
    // roboticHand.follow();
    roboticHand.update();
    // for(let i=0;i<agents.length;i++){
    //     let agent = agents[i];
    //     agent.autoFollow();
    //     // agent.follow(mouseX,mouseY);
    //     agent.update();  
    // } for(let i=0;i<predators.length;i++){
    //     let predator = predators[i];
    //     predator.autoFollow();
    //     // agent.follow(mouseX,mouseY);
    //     predator.update();  
    // }
    pop();
}
