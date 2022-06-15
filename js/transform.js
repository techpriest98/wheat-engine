import {Vector3, Matrix4} from './math.js';

export class Transform {
    position;
    rotation;
    scale;

    matrixView;
    matrixNormal;

    forward;
    up;
    right;

    static deg2Rad = Math.PI / 180;

    constructor(position, rotation, scale) {
        this.position = position || new Vector3(0, 0, 0);
        this.rotation = rotation || new Vector3(0, 0, 0);
        this.scale = scale || new Vector3(1, 1, 1);

        this.matrixView = new Matrix4();
        this.matrixNormal = new Float32Array(9);

        this.forward = new Float32Array(4);
        this.up = new Float32Array(4);
        this.right = new Float32Array(4);
    };

    updateDirection = () => {
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matrixView.raw);
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matrixView.raw);
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matrixView.raw);
        return this;
    };

    updateMatrix = () => {
        this.matrixView
            .reset()
            .vtranslate(this.position)
            .rotateX(this.rotation.x * Transform.deg2Rad)
            .rotateY(this.rotation.y * Transform.deg2Rad)
            .rotateZ(this.rotation.z * Transform.deg2Rad)
            .vscale(this.scale);

        Matrix4.normalMat3(this.matrixNormal, this.matrixView.raw);
        this.updateDirection();
        return this;
    };

    reset = () => {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
        return this;
    };

    setScale = (x, y, z) => {
        this.scale.set(x, y, z);
        return this;

    };
    setPosition = (x, y, z) => {
        this.position.set(x, y, z);
        return this;
    };

    setRotation = (x, y, z) => {
        this.rotation.set(x, y, z);
        return this;
    };

    addScale = (x, y, z) => {
        this.scale.add(x, y, z);
        return this;
    };

    addPosition = (x, y, z) => {
        this.position.add(x, y, z);
        return this;
    };

    addRotation = (x, y, z) => {
        this.rotation.add(x, y, z);
        return this;
    };

}
