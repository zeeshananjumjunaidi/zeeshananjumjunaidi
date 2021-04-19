

const width = window.innerWidth;
const height = window.innerHeight;
let data = [];
let classes = [];
let sum = 0;
let mean = 0;
let variance = 0;
let std = 0;
let min = 0;
let max = 0;
let sqrt2PI = Math.sqrt(2.0 * Math.PI);
let width2 = width / 2;
function setup() {
    createCanvas(width, height);
    imageMode(CENTER);
    rectMode(CENTER);
    console.log("Stats");
    sum = 0;
    for (let i = 0; i < 1000; i++) {
        classes.push(i);
        if(i<30){classes.push(i);} // skewness
    }
    for (let i = -round(width2); i < round(width2); i++) {
        let temp = -classes[round(random() * (classes.length - 1))];
        
        let v= temp;

        data.push(v);
        sum += v;
    }
    // sorting the data
    data.sort((a, b) => { return a - b; });
    min = data[0];
    max = data[data.length - 1];
    mean = sum / data.length;
    variance = 0;
    for (let i = 0; i < data.length; i++) {
        variance += (Math.pow(data[i] - mean, 2) / (data.length - 1));
    }
    std = Math.sqrt(Math.abs(variance));
}
function draw() {
    background(255);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);
    translate(width / 2, height / 2);
    // circle(0,0,20);
    push();
    fill(255, 0, 0); stroke(255, 0, 0);
    let j = 0;

    // circle(-400,6,10)
    // circle(0,0,100)
    // text(getGaussianValue(data[0]),0,2)
    for (let i = -round(width2) + 1; i < round(width2); i++) {
        if (j >= data.length) break;
        j++;
        let v = data[j];
        let g = getGaussianValue(v);
        point(i, -g * 100000);
    }
    pop();
    let mDX = data[round(mouseX) - 1];
    if (mDX || mDX === 0) {
        let T = -getGaussianValue(mDX) * 100000;
        text((mDX.toFixed(2)), mouseX - width2, T);
        line(mouseX - width2, 0, mouseX - width2, T);
    }
    text(`MEAN = ${mean.toFixed(2)}`, 10, mean/2 + 5);
    text(`VAR  = ${variance.toFixed(2)}`, 10, mean/2 + 25);
    text(`STD  = ${std.toFixed(2)}`, 10, mean/2 + 45);

    text(`MIN  = ${min.toFixed(2)}`, 10, mean/2 + 65);
    text(`MAX  = ${max.toFixed(2)}`, 10, mean/2 + 85);

    text('sd1', width2 * 0.68, 0);
    text('sd2', width2 * 0.95, 0);
    text('sd3', width2 * 0.997, 0);
}
function getGaussianValue(x) {
    return (1 / (std * sqrt2PI) * Math.exp(-Math.pow(x - mean, 2) / (2 * variance)));
}