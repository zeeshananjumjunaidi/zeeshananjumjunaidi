class PID {
    constructor(kP = 0.2, kI = 0.0, kD = 0.0, currentTime = undefined) {
        this.kP = kP;
        this.kD = kD;
        this.kI = kI;
        this.sampleTime = 0.0;
        this.currentTime = currentTime!=undefined ? currentTime : Date.now();
        this.lastTime = this.currentTime;
        this.lastError = 0.0;
        this.output = 0.0;
        this.clear();
    }
    clear() {
        this.setPoint = 0.0;
        this.pTerm = 0.0;
        this.iTerm = 0.0;
        this.dTerm = 0.0;

        // Windup Guard
        // https://en.wikipedia.org/wiki/Integral_windup
        this.initError = 0.0;
        this.windupGuard = 10.0;
        this.output = 0.0;
    }
    update(feedbackValue, currentTime = undefined) {
        /* PID UPDATE
         u(t) = K_p e(t) + K_i \int_{0}^{t} e(t)dt + K_d {de}/{dt}
         */
        let error = this.setPoint - feedbackValue;
        this.currentTime = currentTime!=undefined ? currentTime : Date.now()
        let deltaTime = this.currentTime - this.lastTime;
        let deltaError = error - this.lastTime;
        if (deltaTime >= this.sampleTime) {
            this.pTerm = this.kP * error;
            this.iTerm += error * deltaTime;
            if (this.iTerm < -this.windupGuard) {
                this.iTerm = -this.windupGuard
            } else if (this.iTerm > this.windupGuard) {
                this.iTerm = this.windupGuard;
            }
            this.dTerm = 0.0;
            if (deltaTime > 0) {
                this.dTerm = deltaError / deltaTime
            }
            this.lastTime = this.currentTime;
            this.lastError = error;
            this.output = this.pTerm + (this.kI * this.iTerm) + (this.kD * this.dTerm);
        }
    }
    setKp(proportionalGain) {
        this.kP = proportionalGain;
    }
    setKi(integralGain) {
        this.kI = integralGain;
    }
    setKd(differentialGain) {
        this.kD = differentialGain;
    }
    setWindup(windup) {
        this.windupGuard = windup
    }
    setSampleTime(sampleTime) {
        this.sampleTime = sampleTime;
    }
}