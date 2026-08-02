
class PIDController {
    error_old = 0;
    error_old_2 = 0;
    error_sum = 0;
    error_sum2 = 0;

    //PID parameters
    gain_P = 0;
    gain_I = 0;
    gain_D = 0;
    error_sumMax = 20;

    GetFactorFromPIDController(error) {
        let output = this.CalculatePIDOutput(error);

        return output;
    }

    GetFactorFromPIDController(gain_P, gain_I, gain_D, error) {
        this.gain_P = gain_P;
        this.gain_I = gain_I;
        this.gain_D = gain_D;

        let output = this.CalculatePIDOutput(error);

        return output;
    }
    
    GetFactorFromPIDController(gains, error) {
        this.gain_P = gains.x;
        this.gain_I = gains.y;
        this.gain_D = gains.z;

        let output = this.CalculatePIDOutput(error);

        return output;
    }

    time=0;
    setTime(t){
        this.time=t;
    }
    CalculatePIDOutput(error) {
       let output = 0;
        output += this.gain_P * error;
        this.error_sum += this.time * error;
        this.error_sum = this.clamp(this.error_sum, -this.error_sumMax, this.error_sumMax);

        output += this.gain_I * this.error_sum;
        let d_dt_error = (error - this.error_old) / this.time;
        this.error_old_2 = this.error_old;
        this.error_old = error;
        output += this.gain_D * d_dt_error;
        return output;
    }
    clamp = (num, min, max) => Math.min(Math.max(num, min), max);
}