import {Transform} from "./transform.js";

export class Model {
    mesh;
    transform;

    constructor (mesh, transform) {
        this.mesh = mesh;
        this.transform = transform || new Transform();
    }

    preRender = () => {
        this.transform.updateMatrix();
        return this;
    };
}
