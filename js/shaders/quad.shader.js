import {Shader} from "../shader.js";

export class QuadShader extends Shader {
    constructor(gl, projectionMatrix) {
        const vertexShaderSource = [
            '#version 300 es',
            'in vec3 a_position;',
            'in vec2 a_uv;',
            '',
            'uniform mat4 uPMatrix;',
            'uniform mat4 uCameraMatrix;',
            'uniform mat4 uMVMatrix;',
            '',
            'out vec2 uv;',
            '',
            'void main(void) {',
            '   uv = a_uv;',
            '   gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);',
            '}'
        ].join('\n');

        const fragmentShaderSource = [
            '#version 300 es',
            'precision mediump float;',
            '',
            'in vec2 uv;',
            'out vec4 finalColor;',
            '',
            'void main(void) {',
            '   float c = (uv.x <= 0.1 || uv.x >= 0.9 || uv.y <= 0.1 || uv.y >= 0.9) ? 0.0 : 1.0;',
            '   finalColor = vec4(c, c, c, 1.0 -c);',
            '}'
        ].join('\n');

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.setPerspective(projectionMatrix);
        gl.useProgram(null);
    }
}
