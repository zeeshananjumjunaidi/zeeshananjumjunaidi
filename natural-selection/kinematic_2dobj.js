
class Kinematic2DObject {
    constructor(x, y, objects, index, segmentSize = 5, segmentCount = 20, speed = 10, isPredator = false) {
        this.segmentSize = segmentSize;
        this.segmentCount = segmentCount;
        this.index = index;
        this.objects = objects;
        this.speed = 2;// Math.random()*speed;
        this.isPredator = isPredator;
        let current = Segment.createRootInstance(width / 2, height / 2, 0, segmentSize, 1);

        for (let i = 0; i < segmentCount; i++) {
            let st = Segment.createSegment(current, 0, segmentSize, 2 + i);
            current.child = st;
            current = st;
        }
        this.dying = false;
        this.root = current;
        this.root.a.x = x;
        this.root.a.y = y;
        this.target = new p5.Vector(random(0, width), random(0, height));
        this.food = 1;
        this.age = 0;//random(255, 500);
        this.maxAge = round(random(2100, 2155));
        this.deathRate = random(0.006, 0.06);
        this.colorType = random() > 0.5 ? 1 : random() > 0.4 ? 2 : 0;
        this.preys = [];
    }
    autoFollow() {
        // find the nearest target
        let nearestPrey = null;
        if (this.preys.length > 0) {
            nearestPrey = this.preys[0];
            for (let i = 1; i < this.preys.length; i++) {
                let p = this.preys[i];
                if (dist(nearestPrey.root.a.x, nearestPrey.root.a.y, this.root.a.x, this.root.a.y) >
                    dist(this.root.a.x, this.root.a.y, p.root.a.x, p.root.a.y)
                ) {
                    // eat prey       
                    nearestPrey = p;
                }
            }
            this.target = new p5.Vector(nearestPrey.root.a.x, nearestPrey.root.a.y);
        }



        if (dist(this.target.x, this.target.y, this.root.a.x, this.root.a.y) < 1) {
            if (nearestPrey) {
                nearestPrey.kill();

            }
            // this.target.x = random(0, width);
            // this.target.y = random(0, height);
        }
    }
    kill() {
        if (this.dying == false) {
            this.dying = true;
            this.objects.splice(this.objects.indexOf(a => a.index == this.index), 1);
            this.age = 0;
            // setTimeout(async() => {
            //     console.log('dying',this.index);
            //     this.objects.splice(this.objects.indexOf(a => a.index == this.index), 1);
            //     // this.objects.splice(this.objects.indexOf(a => this.index == a.index), 1);
            // }, 2000);
        }
    }
    addPrey(preys) {
        this.preys = preys;
    }
    follow(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
    update() {
        if (dist(this.target.x, this.target.y, this.root.a.x, this.root.a.y) > 5) {
            // text(`${this.target.x.toFixed(2)},${this.target.y.toFixed(2)}`,
            // this.target.x,this.target.y);
            // life goal
            fill(0);
            //  circle(this.target.x, this.target.y, 3 * this.food);

            let r = atan2(this.root.a.y - this.target.y, this.root.a.x - this.target.x);

            let d = new p5.Vector(cos(r) * this.speed, sin(r) * this.speed);
            d.x += this.root.a.x;
            d.y += this.root.a.y;

            this.root.follow(d.x, d.y);
        } else {

            if (!this.dying) {
                this.target.x = random(0, width);
                this.target.y = random(0, height);
            }
            this.achieveLifeGoal = true;
            if (this.food < 3)
                this.food += 1;
            this.age = 0; // resetting age if feeded
        }
        // death equation, death rate = 0.006
        this.age += deltaTime * this.deathRate;
        if (this.age < 300 && this.age > 100 && Math.random() >= 0.999) {
            // reproduction // Asexual for now.
            // console.log("Birth at age of "+this.age);
            this.objects.push(new Kinematic2DObject(this.x, this.y, this.objects, this.objects.length,
                this.segmentSize, this.segmentCount, this.speed));
        }
        // this.root.follow(this.target.x,this.target.y);
        let predSize = this.isPredator ? 5 : 1;
        if (this.dying) {
            stroke(255, 0, 0);
        } else {
            if (this.colorType == 1) {
                stroke(round(this.maxAge - this.age), 255, 0, round(this.maxAge - this.age));
            } else if (this.colorType == 2) {
                stroke(0, 0, round(this.maxAge - this.age), round(this.maxAge - this.age));
            } else {
                stroke(0, round(this.maxAge - this.age), 0, round(this.maxAge - this.age));
            }
        }
        this.root.update();
        this.root.show();
        let next = this.root.parent;
        let size = 5;
        while (next != null) {
            size = 30 * next.index / 100;
            strokeWeight(size * predSize);
            next.followChild();
            next.update();
            next.show();
            next = next.parent;
        }
        if (this.age >= this.maxAge) {
            //dead
            if (this.objects) {
                this.objects.splice(this.objects.indexOf(a => a.index == this.index), 1);
            }
        }
    }
}