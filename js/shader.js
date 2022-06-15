import {ShaderUtils} from "./utils/shader-utils.js";

export class Shader {
    #gl;
    #vertexShader;
    #fragmentShader;
    #attribLoc;
    #uniformLoc;

    program;

    constructor(gl, vertexShaderSource, fragmentShaderSource) {
        this.#gl = gl;
        this.#vertexShader = ShaderUtils.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        this.#fragmentShader =  ShaderUtils.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        this.program = ShaderUtils.createProgram(gl, this.#vertexShader, this.#fragmentShader, true);

        if (this.program) {
            gl.useProgram(this.program);
            this.#attribLoc = ShaderUtils.getStandardAttributeLocation(gl, this.program);
            this.#uniformLoc = ShaderUtils.getStandardUniformLocation(gl, this.program);
        }
    }

    activate = () => {
        this.#gl.useProgram(this.program);
        return this;
    };

    deactivate = () => {
        this.#gl.useProgram(null);
        return this;
    };

    setPerspective = (matrixData) => {
        this.#gl.uniformMatrix4fv(this.#uniformLoc.perspective, false, matrixData);
        return this;
    };

    setModelMatrix = (matrixData) => {
        this.#gl.uniformMatrix4fv(this.#uniformLoc.modelMatrix, false, matrixData);
        return this;
    };

    setCameraMatrix = (matrixData) => {
        this.#gl.uniformMatrix4fv(this.#uniformLoc.cameraMatrix, false, matrixData);
        return this;
    };

    dispose = () => {
        if (this.#gl.getParameter(this.#gl.CURRENT_PROGRAM) === this.program) {
            this.deactivate();
            this.#gl.deleteProgram(this.program);
        }
        return this;
    };

    preRender = () => {
        return this;
    };

    renderModel = model => {
        const {mesh, transform} = model;

        this.setModelMatrix(transform.matrixView.raw);
        this.#gl.bindVertexArray(mesh.vao);

        if (mesh.indexCount) {
            this.#gl.drawElements(mesh.drawMode, mesh.indexCount, this.#gl.UNSIGNED_SHORT, 0);
        } else {
            this.#gl.drawArrays(mesh.drawMode, 0, mesh.vertexCount);
        }

        this.#gl.bindVertexArray(null);
        return this;
    };
}
