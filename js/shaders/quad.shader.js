import {Shader} from "../shader.js";

export class QuadShader extends Shader {
    #mainTexture;

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
            'out highp vec2 uv;',
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
            'in highp vec2 uv;',
            'uniform sampler2D uMainTex;',
            'out vec4 finalColor;',
            '',
            'void main(void) {',
            '   finalColor = texture(uMainTex, vec2(uv.s, uv.t));',
            '}'
        ].join('\n');

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.setPerspective(projectionMatrix);
        this.#mainTexture = -1;
        gl.useProgram(null);
    }

    setTexture = id => {
        this.#mainTexture = id;
        return this;
    };

    preRender = () => {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.#mainTexture);
        this.gl.uniform1i(this.uniformLoc.mainTexture, 0);
        return this;
    }
}
