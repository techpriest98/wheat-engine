import {Shader} from "../shader.js";
import {ShaderUtils} from "../utils/shader-utils.js";
import {GlUtils} from "../utils/gl-utils.js";

export class GridAxisShader extends Shader {
    #uColorLock;

    constructor(gl, projectionMatrix) {
        const vertexShaderSource =
        `#version 300 es
        
        in vec3 a_position;
        layout(location=4) in float a_color;
    
        uniform vec3 uColor[4];
    
        uniform mat4 uPMatrix;
        uniform mat4 uCameraMatrix;
        uniform mat4 uMVMatrix;
    
        out lowp vec4 color;
    
        void main(void) {
            color = vec4(uColor[ int(a_color)], 1.0);
            gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
        }`;

        const fragmentShaderSource =
        `#version 300 es
        
        precision mediump float;
        
        in vec4 color;
        out vec4 finalColor;
        
        void main(void) {
           finalColor = color;
        }`;

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.setPerspective(projectionMatrix);
        this.#uColorLock = ShaderUtils.getStandardUniformLocation(gl, this.program).color;
        gl.uniform3fv(this.#uColorLock, new Float32Array(GlUtils.rgbConverter(
            '#909090',
            '#ff0000',
            '#00ff00',
            '#0000ff'
        )));

        gl.useProgram(null);
    }
}
