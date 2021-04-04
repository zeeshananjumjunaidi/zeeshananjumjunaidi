

var height = window.innerHeight;
var width = window.innerWidth;
var agents =[];
function setup(){    
    width = window.innerWidth;
    height = window.innerHeight;
    createCanvas(width,height);
    
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    for(let i=0;i<100;i++){
        let agent =new Kinematic2DObject(random(0,width),random(0,height),agents,i,5,5);
        agents.push(agent);
    } 
}


function draw(){
    
    background(0x2e3d49);
    push();
    for(let i=0;i<agents.length;i++){
        let agent = agents[i];
        agent.autoFollow();
        // agent.follow(mouseX,mouseY);
        agent.update();  
    }
    pop();
}
