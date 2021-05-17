
class Detector{
    constructor(targets,frame_window_in_sec=10){
        this.frame_window_in_sec=frame_window_in_sec;
        this.targets=targets;
        this.prior={};
    }

    detect(){
        for(let i=0;i<this.targets.length;i++){
            let t = this.targets[i];
            let x=t.x;
            let y=t.y;
            if(this.prior[t.id]){
                this.prior[t.id].push([x,y]);
                if(this.prior[t.id].length>this.frame_window_in_sec){
                    this.prior[t.id]= this.prior[t.id].slice(1);
                }
            }
            else{
                this.prior[t.id] = [x,y];
            }
        }
        let o=0;
        let x=0;
        let y=0;
        for(let p in this.prior){
            for(let j=1;j<this.prior[p].length;j++){
                let pr = this.prior[p][j-1];
                let pr1 = this.prior[p][j];
                let numerator = (pr1[1]-pr[1])
                let denumerator = !(pr1[0]-pr[0])?1:(pr1[0]-pr[0]);
                o=Math.atan2(numerator,denumerator);
                x=pr[0];
                y=pr[1];
            }
            line(x,y,x+Math.cos(o)*10,y+Math.sin(o)*10);
        }
    }
}