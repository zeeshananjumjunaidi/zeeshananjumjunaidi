class Map{
    constructor(){
        this.landmarks=[];
    }
    addLandmark(landmark){
        this.landmarks.push(landmark);
    }
    removeLandMarkById(id){
        this.landmarks.splice(this.landmarks.indexOf(x=>x.id==id),1);
    }
    loadMap(){
        
    }
}