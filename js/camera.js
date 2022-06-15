import {Matrix4} from "./math.js";
import {Transform} from "./transform.js";

export class Camera {
    #gl;
    #fow;
    #near;
    #far;
    #ratio;
    #mode;

    projectionMatrix;
    viewMatrix;
    transform;

    static MODE_ORBIT = 'ORBIT';
    static MODE_FREE = 'FREE';

    constructor(gl, fow = 45, near = 0.1, far = 100, transform) {
        this.#gl = gl;
        this.#fow = fow;
        this.#near = near;
        this.#far = far;

        this.projectionMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.transform = transform || new Transform();

        this.#ratio = gl.canvas.width / gl.canvas.height;
        Matrix4.perspective(this.projectionMatrix, fow, this.#ratio, near, far);
        this.#mode = Camera.MODE_ORBIT;
    }

    updateViewMatrix = () => {
        if (this.#mode === Camera.MODE_FREE) {
            this.transform.matrixView
                .reset()
                .vtranslate(this.transform.position)
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad)
        } else {
            this.transform.matrixView
                .reset()
                .rotateX(this.transform.rotation.x * Transform.deg2Rad)
                .rotateY(this.transform.rotation.y * Transform.deg2Rad)
                .vtranslate(this.transform.position)
        }

        this.transform.updateDirection();
        Matrix4.invert(this.viewMatrix, this.transform.matrixView.raw);
        return this;
    };

    panX = v => {
        this.transform.position.x += this.transform.right[0] * v;
        if (this.#mode === Camera.MODE_ORBIT) {
            return this;
        }
        this.updateViewMatrix();
        this.transform.position.y += this.transform.right[1] * v;
        this.transform.position.z += this.transform.right[2] * v;

        return this;
    };

    panY = v => {
        this.updateViewMatrix();
        this.transform.position.y += this.transform.up[1] * v;
        if (this.#mode === Camera.MODE_ORBIT) {
            return;
        }
        this.transform.position.x += this.transform.up[0] * v;
        this.transform.position.z += this.transform.up[2] * v;
    };

    panZ = v => {
        this.updateViewMatrix();
        if (this.#mode === Camera.MODE_ORBIT) {
            this.transform.position.z += this.transform.position.z * v;
        } else {
            this.transform.position.x += this.transform.forward[0] * v;
            this.transform.position.y += this.transform.forward[1] * v;
            this.transform.position.z += this.transform.forward[2] * v;
        }
    };
}

export const CameraController = (gl, camera) => {
    const box = gl.canvas.getBoundingClientRect();
    const offsetX = box.left;
    const offsetY = box.top;

    const canvas = gl.canvas;

    const rotationRate = -300;
    const panRate = 5;
    const zoomRate = 50;

    let initX = 0;
    let initY = 0;
    let prevX = 0;
    let prevY = 0;

    canvas.addEventListener('mousedown', e => onMouseDown(e));

    const getMouseVec2 = e => ({x: e.pageX - offsetX, y: e.pageY - offsetY});

    const onMouseUp = () => {
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseMove);
    };

    const onMouseDown = e => {
        initX = prevX = e.pageX - offsetX;
        initY = prevY = e.pageY - offsetY;

        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousemove', onMouseMove);
    };

    const onMouseMove = e => {
        const {x, y} = getMouseVec2(e);
        const dx = x - prevX;
        const dy = y - prevY;

        if (e.shiftKey) {
            camera.panX(-dx * (panRate / canvas.width));
            camera.panY(dy * (panRate / canvas.height));
        } else if (e.ctrlKey) {
            camera.panZ(dy * (zoomRate / canvas.height));
        } else {
            camera.transform.rotation.y += dx * (rotationRate / canvas.width);
            camera.transform.rotation.x += dy * (rotationRate / canvas.height);
        }

        prevX = x;
        prevY = y;
    };
};