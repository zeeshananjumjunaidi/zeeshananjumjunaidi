
class Twiddle {
    constructor(pid) {
        this.pid = pid;
        this.p = [this.pid.kP, this.pid.kI, this.pid.kD];
        this.dp = [1,1,1];
    }
    calcError() {
        return this.pid.setPoint - this.pid.output;
    }
    sum(v){
        return v[0]+v[1]+v[2];
    }
    update(){
        // this.p =  [this.pid.kP, this.pid.kI, this.pid.kD];
        //let dp = [0,0,0]
        let bestError = this.calcError();
        let threshhold = 0.0001
        while(this.sum(this.dp)>threshhold){
            for(let i=0;i<3;i++){
                this.p[i] +=this.dp[i];
                let err = this.calcError()
                if(err < bestError){
                    bestError = err
                    this.dp[i] *=1.1
                }else{
                    this.p[i]-= 2 * this.dp[i]
                    err = this.calcError()
                    if(err<bestError){
                        bestError=err
                        this.dp[i] *= 1.05
                    }else{
                        this.p[i] += this.dp[i]
                        this.dp[i] *= 0.95
                    }
                }
            }
        }
        return this.p;
    }

}