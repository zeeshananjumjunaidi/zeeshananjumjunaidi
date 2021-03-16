
class Twiddle {
    constructor(pid) {
        this.pid = pid;
        this.p = [this.pid.kP, this.pid.kI, this.pid.kD];
    }
    calcError() {
        return this.pid.setPoint - this.pid.output;
    }
    sum(v){
        return v[0]+v[1]+v[2];
    }
    update(){
        this.p =  [this.pid.kP, this.pid.kI, this.pid.kD];
        dp = [0,0,0]
        let bestError = this.calcError();
        let threshhold = 0.01
        while(this.sum(dp)>threshhold){
            for(let i=0;i<3;i++){
                this.p[i] +=dp[i];
                let err = this.calcError()
                if(err < bestError){
                    bestError = err
                    dp[i] *=1.1
                }else{
                    this.p[i]-= 2 * dp[i]
                    err = this.calcError()
                    if(err<bestError){
                        bestError=err
                        dp[i] *= 1.05
                    }else{
                        this.p[i] += dp[i]
                        dp[i] *= 0.95
                    }
                }
            }
        }
        return this.p;
    }

}