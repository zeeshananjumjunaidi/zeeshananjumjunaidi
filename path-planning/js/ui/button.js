class Button {
    constructor(x, y, width, height, label,func=()=>{}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.background = color(200, 200, 200);
        this.foreground = color(15, 15, 15);
        this.activeBackground = this.background;
        this.activeForeground = this.foreground;
        this.textSize = 15;
        this.isMouseOver = false;
        this.func=func;
    }
    setLabel(txt) {
        this.label = txt;
    }
    show() {
        textSize(this.textSize);
        noStroke();
        fill(this.activeBackground);
        rect(this.x, this.y, this.width, this.height, 6);
        fill(this.activeForeground);
        let txtWidth = textWidth(this.label);
        text(this.label,
            this.x - (this.width / 2) + txtWidth,
            this.y + (this.height / 2) -
            this.textSize);
    }
    hover() {
        let x = mouseX - width / 2 + this.width / 2;
        let y = mouseY - height / 2 + this.height / 2;
        let dx = this.x + this.width / 2;
        let dy = this.y + this.height / 2;
        if (x > this.x &&
            y > this.y &&
            mouseX - width / 2 < dx &&
            mouseY - height / 2 < dy) {
            this.isMouseOver = true;
            this.activeBackground = color(250, 250, 250);
        } else {
            this.isMouseOver = false;
            this.activeBackground = this.background;
        }
    }
    pressed() {
        if(this.isMouseOver){
            print(this.label+' pressed');
        }
        if(this.func){
            this.func();
        }
    }
}