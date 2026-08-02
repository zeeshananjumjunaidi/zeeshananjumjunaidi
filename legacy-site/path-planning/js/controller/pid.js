class PIDController{

    constructor(Kp=0,Ki=0,Kd=0){
        this.Kp=Kp;
        this.Ki=Ki;
        this.Kd=Kd;
        this.pErr=0;
        this.iErr=0;
        this.dErr=0;
    }
    updateErrorP(cte){
        this.pErr=cte;
    }
    updateErrorPD(cte){
        this.dErr = cte - this.pErr;
        this.pErr=cte;
    }
    updateErrorPID(cte){
        this.dErr = cte - this.pErr;
        this.iErr +=cte;
        this.pErr=cte;
    }
   totalError(){
       return -this.Kp * this.pErr;
   }
   getValue(){
       return -this.Kp*this.pErr - this.Kd*this.dErr - this.Ki*this.iErr;
   }
}