import {Shader} from "../shader.js";
import {GlUtils} from "../utils/gl-utils.js";
import {ShaderUtils} from "../utils/shader-utils.js";

export class OpaqueColorShader extends Shader {
    #uColorLoc;

    #color;
    #mainTexture;

    constructor(gl, projectionMatrix, color = '#ffffff') {
        const vertexShaderSource =
        `#version 300 es
        
        in vec3 a_position;
        in vec2 a_uv;
        
        uniform mat4 uPMatrix;
        uniform mat4 uCameraMatrix;
        uniform mat4 uMVMatrix;
        
        out highp vec2 uv;
        
        void main(void) {
            uv = a_uv;
            gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
        }`;

        const fragmentShaderSource =
        `#version 300 es
        
        precision mediump float;
        
        in highp vec2 uv;
        uniform sampler2D uMainTex;
        uniform vec3 uColor;

        out vec4 finalColor;
        
        void main(void) {
            finalColor = texture(uMainTex, vec2(uv.s, uv.t)) * vec4(uColor.xyz, 1.0);
        }`;

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.setPerspective(projectionMatrix);
        this.#uColorLoc = ShaderUtils.getStandardUniformLocation(gl, this.program).color;
        this.#color = GlUtils.rgbConverter(color);
        this.#mainTexture = -1;
        gl.uniform3fv(this.#uColorLoc, new Float32Array(this.#color));
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
        this.gl.uniform3fv(this.#uColorLoc, new Float32Array(this.#color));
        return this;
    }
}
