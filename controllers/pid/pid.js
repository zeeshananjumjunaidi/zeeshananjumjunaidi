class PID{
    constructor(kP=0.2,kI=0.0,kD=0.0,current_time=undefined){
        this.kP=kP;
        this.kD=kD;
        this.kI=kI;
        this.sample_time = 0.0;
        this.current_time = current_time?current_time?Date.now();
        this.last_time = this.current_time;
        this.output = 0.0;
        this.clear();
    }
    clear(){
        this.setPoint= 0.0;
        this.pTerm = 0.0;
        this.iTerm = 0.0;
        this.dTerm = 0.0;
        
        // Windup Guard
        // https://en.wikipedia.org/wiki/Integral_windup
        this. initError=0.0;
        this.windupGuard = 10.0;
        this.output = 0.0;
    }

}