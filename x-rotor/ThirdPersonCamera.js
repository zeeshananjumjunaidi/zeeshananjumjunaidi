

class ThridPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = this._params.camera;
        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
        console.log(this._params);
        console.log(this._camera);
    }
    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-35, 0, 10);
        idealOffset.applyQuaternion(this._params.target.quaternion);
        idealOffset.add(this._params.target.position);
        return idealOffset;
    }
    _CalculateIdealLookAt() {
        const idealLookAt = new THREE.Vector3(0, 0, 0);
        idealLookAt.applyQuaternion(this._params.target.quaternion);
        idealLookAt.add(this._params.target.position);
        return idealLookAt;
    }
    update(timeDelta) {
        if (this._params.target && this._camera) {
            const idealOffset = this._CalculateIdealOffset();
            const idealLookAt = this._CalculateIdealLookAt();

            // const t = 0.15 ;
            // const t = 4.0 * timeDelta;
            const t = 1.0 - Math.pow(0.001,timeDelta);

            this._currentPosition.lerp(idealOffset,t);
            this._currentLookAt.lerp(idealLookAt,t);

            this._camera.position.copy(this._currentPosition);
            this._camera.lookAt(this._currentLookAt);
        }
    }
}