
class Detector{
    constructor(targets,frame_window_in_sec=10){
        this.frame_window_in_sec=frame_window_in_sec;
        this.targets=targets;
        this.prior={};
        this.Pd = 1; // probability of detection.
        // A target-present decision when no target (only noise) is present is called a “false alarm.”
        this.Pfa = 0; // Probability of false alarm.
        // Maximize Pd and minimze Pfa
        this.SNR = 0;// Signal to Noise ratio
        /*Two approaches to increasing SNR are to use higher-energy (i.e., larger amplitude or longer duration) waveforms or to add (or “integrate”) multiple return
        pulses, either coherently (in-phase) or non-coherently (summing magnitudes or
        without phase coherence). 
        Ref: Phased-Array Radar Design: Application of Radar Fundamentals by Tom Jeffrey
        */
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
            let mag = 20;
            line(x,y,x+Math.cos(o)*mag,y+Math.sin(o)*mag);
        }
    }
}