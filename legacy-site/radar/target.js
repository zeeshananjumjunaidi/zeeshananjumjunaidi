
class Target {
    constructor(id, x, y, heading, speed = 1, altitude = 2000, size = 10) {
        this.id = id;
        this._x = x;
        this._y = y;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.speed = speed;
        this.size = size;
        this.radarBeamAngle=0;
        this.radarBeamOrigin=new p5.Vector(width/2,height/2);
        this.currentAngleWithRadar=0;
        //altitude in feet
        this.altitude = altitude;
        this.selected = false;
        this.hover = false;
        this.fighter = loadImage('fighter_jet.png');
        this.airplane_1 = loadImage('airplane_1.png');
        this.airplane_2 = loadImage('airplane_2.png');
        this.airplane_3 = loadImage('airplane_3.png');
        this.imageAngle = 0;
        this.planeColor = color(200, 200, 200);
        if (random() > 0.9) {
            this.planeColor=color(255,0,0);
            this.image = this.fighter;
        }
        else if (random() > 0.7) {
            this.planeColor=color(0,200,0);
            this.image = this.airplane_1;
        }
        else if (random() > 0.6) {
            this.planeColor=color(0,200,200);
            this.image = this.airplane_2;
        }
        else {
            this.planeColor=color(200,200,200);
            this.imageAngle = Math.PI / 2;
            this.image = this.airplane_3;
        }
        print(this.planeColor)
    }
    draw() {
        this.currentAngleWithRadar = Math.atan2(this.radarBeamOrigin.y-this.y,this.radarBeamOrigin.x-this.x);

        let maxDist = (width / 2) + (height / 2);
        let distC = dist(this.x, this.y, width / 2, height / 2);
        if (this.hover) {
            noFill();
            stroke(255, 0, 0);
            circle(this.x, this.y, this.size * 2);
        }
        if (this.selected) {
            stroke(255, 0, 0, 100);
            line(this.x, this.y, width / 2, height / 2);
        }
        push();
        // rotate(this.heading-Math.PI/2);
        translate(this.x, this.y);
        rotate(this.heading + this.imageAngle);
        tint(this.planeColor);
        image(this.image, 0, 0, 20, 20);
        pop();
        //noStroke();
        //fill(255, 0, 0,255-((distC/maxDist)*255));
        //circle(this.x, this.y, this.size);
        this.x += Math.cos(this.heading) * this.speed;
        this.y += Math.sin(this.heading) * this.speed;
        if (this.x > width) { this.x = this._x; this.y = this._y; }
        if (this.y > height) { this.x = this._x; this.y = this._y; }
       
        if (this.selected) {noStroke();
            fill(0, 0, 0.100,160);
            rect(this.x-10,this.y-10,100,60);
            fill(0, 255, 0);
            text(`##### ID:${this.id}\n${this.x.toFixed(2)},${this.y.toFixed(2)}\n${this.altitude.toFixed(2)}
        `, this.x, this.y + 10);
        } else {
         //   let beamDistance = abs(this.currentAngleWithRadar-this.radarBeamAngle);
          //  this.planeColor.levels[3]=255-beamDistance/Math.PI*255;
            fill(0, 255, 0);
             text((distC / maxDist).toFixed(2), this.x, this.y);
           /// text((beamDistance).toFixed(2), this.x, this.y);
        }

    }
}