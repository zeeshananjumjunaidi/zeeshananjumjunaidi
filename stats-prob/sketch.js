

const width = window.innerWidth;
const height = window.innerHeight;
let data = [];
let classes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
    for (let i = -round(width / 2); i < round(width / 2); i++) {
        let v = classes[round(random() * (classes.length - 1))] * 10000;
        data.push(v);
        sum += v;
    }
    mean = sum / data.length;
    variance = 0;
    for (let i = 0; i < data.length; i++) {
        variance += Math.pow(data[i] - mean, 2) / data.length - 1;
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
        let g = getGaussianValue(data[j]);
        circle(i, g, 2);
        // text(data[j],data[j]*10,0);
        // if(j>15)
        // break;
    }
    pop();
}
function getGaussianValue(v) {
    return (1 / (std * sqrt2PI)) * Math.exp(-0.5 * (Math.pow((v - mean) / std, 2)));
}