import {Shader} from "../shader.js";

export class GridAxisShader extends Shader {
    #uColorLock;

    constructor(gl, projectionMatrix) {
        const vertexShaderSource = [
            '#version 300 es',
            'in vec3 a_position;',
            'layout(location=4) in float a_color;',
            '',
            'uniform vec3 uColor[4];',
            '',
            'uniform mat4 uPMatrix;',
            'uniform mat4 uCameraMatrix;',
            'uniform mat4 uMVMatrix;',
            '',
            'out lowp vec4 color;',
            '',
            'void main(void) {',
            '   color = vec4(uColor[ int(a_color)], 1.0);',
            '   gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);',
            '}'
        ].join('\n');

        const fragmentShaderSource = [
            '#version 300 es',
            'precision mediump float;',
            '',
            'in vec4 color;',
            'out vec4 finalColor;',
            '',
            'void main(void) {',
            '   finalColor = color;',
            '}'
        ].join('\n');

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.setPerspective(projectionMatrix);
        this.#uColorLock = gl.getUniformLocation(this.program, 'uColor');
        gl.uniform3fv(this.#uColorLock, new Float32Array([
            0.8, 0.8, 0.8,
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]));

        gl.useProgram(null);
    }
}
