
/*
Reference: https://github.com/zeeshananjumjunaidi/ParticleFilter/blob/master/src/main.cpp
A particle filter is a non-parametric implementation of the Bayes filter
and is often used to estimate the state of dynamical systems. 
Estimation of non-Gaussian, nonlinear processes.

A particle filter represents the belief by particles, it is also called
Monte Carlo Localization (MCL). Like grid localisation, MCL is
applicable to both local and global localization problems

The key ‘trick’ of the particle filter is the resampling, which is an
implementation of survival of the fittest in a probabilistic manner. It
duplicates the particles to the regions in state space with high
posterior probabilities.

Steps:
Generate random guess particles with x,y,orientation, and weight.
Spread these particles uniformly.
Particles survival is based on the consistency with sensor measurements.
The consistency is measured based on mismatch between actual measurement and predicted measurement
 which is called weights.
 Probability of the survival of a particle is based on the weight.
 The weight is calculated as the closeness of the actual measurement of the particle with the
 predicted measurement.
Resampling:
In resampling technique, we create generate new random particles from the previous ones
with replacement in proportion to their weight. After resampling, particles with
  higher weights likely to stay and all others may die out.
  In order to do the resampling, Resampling Wheel technique is used.
*/

// Resampling
function resampling(N, w) {
    let p3 = [];
    let index = round(random.random() * N);
    let beta = 0;
    let mw = max(w);
    for (let i = 0; i < N; i++) {
        beta += random.random() * 2 * mw;
        while (w[index] < beta) {
            beta = beta - w[index];
            index += 1;
        }
        p3.append(p[index]);
    }
    return p3;
}

class ParticleFilter {
    constructor(position, orientation, no_of_particles = 500) {
        this.position = position;
        this.orientation = orientation;
        this.no_of_particles = no_of_particles;

        this.weights = [];
        
        for(let i=0;i<this.no_of_particles;i++){
            this.weights.push(random());
        }
        this.is_initialized = false;
    }
    /**
     * init Initializes particle filter by initializing particles to Gaussian
     *   distribution around first position and all the weights to 1.
     * @param x Initial x position [m] (simulated estimate from GPS)
     * @param y Initial y position [m]
     * @param theta Initial orientation [rad]
     * @param std[] Array of dimension 3 [standard deviation of x [m], standard deviation of y [m]
     *   standard deviation of yaw [rad]]
     */
    init(position, orientation, std = []) {
        this.position = position;
        this.orientation = orientation;
        this.std = std;
    }
    /**
     * prediction Predicts the state for the next time step
     *   using the process model.
     * @param delta_t Time between time step t and t+1 in measurements [s]
     * @param std_pos[] Array of dimension 3 [standard deviation of x [m], standard deviation of y [m]
     *   standard deviation of yaw [rad]]
     * @param velocity Velocity of car from t to t+1 [m/s]
     * @param yaw_rate Yaw rate of car from t to t+1 [rad/s]
     */
    prediction(delta_t, std_pos, velocity, yaw_rate) {

    }

    step() {
        if (this.is_initialized) {
            return;
        }
    }
    /**
     * dataAssociation Finds which observations correspond to which landmarks (likely by using
     *   a nearest-neighbors data association).
     * @param predicted Vector of predicted landmark observations
     * @param observations Vector of landmark observations
     */
    dataAssociation(predicted, observations) {

    }
    /**
     * updateWeights Updates the weights for each particle based on the likelihood of the 
     *   observed measurements. 
     * @param sensor_range Range [m] of sensor
     * @param std_landmark Array of dimension 2 [standard deviation of range [m],
     *   standard deviation of bearing [rad]]
     * @param observations Vector of landmark observations
     * @param map Map class containing map landmarks
     */
    updateWeights(sensor_range, std_landmark, observations,
        map_landmarks) {

    }
    /**
     * resample Resamples from the updated set of particles to form
     *   the new set of particles.
     */
    resample() {

    }

    /*
     * Set a particles list of associations, along with the associations calculated world x,y coordinates
     * This can be a very useful debugging tool to make sure transformations are correct and assocations correctly connected
     */
    SetAssociations(particle, associations, sense_x, sense_y) {

    }
    /**
     * initialized Returns whether particle filter is initialized yet or not.
     */
    initialized() {
        return this.is_initialized;
    }
    getAssociations(best) { }
    getSenseX(best) { }
    getSenseY(best) { }
    draw(){
        push();
        for(let i=0;i<this.no_of_particles;i++){
        }
        pop();
    }
}