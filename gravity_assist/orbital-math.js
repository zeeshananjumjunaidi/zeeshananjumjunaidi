const G = 6.67; // actual value is 6.67e-27

function getLinearVelocityToOutrunPlanetGravity(distSC_P,M){
        return Math.sqrt((G*M)/(distSC_P));
}
function getEscapeVelocity(M,distSC_P){
    return Math.sqrt((2*G*M)/distSC_P);
}