import {Shader} from "../shader.js";

export class SkyMapShader extends Shader {
    #skyTexture;

    constructor(gl, projectionMatrix, skyTexture) {
        const vertexShaderSource =
        `#version 300 es
        
        in vec3 a_position;
        in vec2 a_uv;
        
        uniform mat4 uPMatrix;
        uniform mat4 uCameraMatrix;
        uniform mat4 uMVMatrix;
        
        out highp vec3 texCoord;
        
        void main(void) {
            texCoord = a_position.xyz;
            gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
        }`;

        const fragmentShaderSource =
            `#version 300 es
        
        precision mediump float;
        
        in highp vec3 texCoord;
        uniform samplerCube uSkyTex;

        out vec4 finalColor;
        
        void main(void) {
            finalColor = texture(uSkyTex, texCoord);
        }`;

        super(gl, vertexShaderSource, fragmentShaderSource);

        this.uniformLoc.skyTextureLoc = gl.getUniformLocation(this.program, 'uSkyTex');
        this.#skyTexture = skyTexture;

        this.setPerspective(projectionMatrix);
        gl.useProgram(null);
    }

    preRender = () => {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.#skyTexture);
        this.gl.uniform1i(this.uniformLoc.skyTextureLoc, 0);

        return this;
    }
}
