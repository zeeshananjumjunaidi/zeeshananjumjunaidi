
class Detector{
    constructor(targets,frame_window_in_sec=10){
        this.frame_window_in_sec=frame_window_in_sec;
        this.targets=targets;
    }

    detect(){
        for(let i=0;i<this.targets.length;i++){
            let t = this.targets[i];
            let x=t.x;
            let y=t.y;
            let o=t.heading;
        }
    }
}