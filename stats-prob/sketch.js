

const width = window.innerWidth;
const height = window.innerHeight;
let data = [];
let classes = [];
let sum = 0;
let mean = 0;
let variance = 0;
let std = 0;
let sqrt2PI = Math.sqrt(2.0 * Math.PI);
function setup() {
    createCanvas(width, height);
    imageMode(CENTER);
    rectMode(CENTER);
    console.log("Stats");
    sum = 0;
    for(let i=0;i<100;i++){
        classes.push(i);
    }
    for (let i = -round(width / 2); i < round(width / 2); i++) {
        let v = -classes[round(random() * (classes.length - 1))];
        data.push(v);
        sum += v;
    }
    // sorting the data
     data.sort((a,b)=>{return a-b;});
    mean = sum / data.length;
    variance = 0;
    for (let i = 0; i < data.length; i++) {
        variance += (Math.pow(data[i] - mean, 2) / (data.length - 1));
    }
    std = Math.sqrt(Math.abs(variance));
}
function draw() {
    background(255);
    translate(width / 2, height / 2);
    // circle(0,0,20);
    push();
    fill(255, 0, 0); stroke(255, 0, 0);
    let j = 0;

    // circle(-400,6,10)
    // circle(0,0,100)
    // text(getGaussianValue(data[0]),0,2)
    for (let i = -round(width / 2); i < round(width / 2); i++) {
        if (j >= data.length) break;
        j++;
        let v = data[j];
        let g = getGaussianValue(v);
        circle(i, -g*10000, 2);
        // text(data[j],data[j]*10,0);
        // if(j>15)
        // break;
    }
    pop();
}
function getGaussianValue(x) {
    return (1/ (std * sqrt2PI) * Math.exp(-Math.pow(x-mean,2)/ (2*variance) ) );
}