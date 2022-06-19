import {GL_ATTR_MAP} from "../gl.js";

export const ShaderUtils = {
    displayError: (source, error) => {
        const errorLineNumber = +error.split(':')[2] - 1;
        const lines = source.split('\n');
        const formattedSrc = lines.map((line, id) => {
            const maxDigit = (lines.length).toString().length;
            const currentDigit = (id + 1).toString().length;
            const prefix = new Array(((maxDigit-currentDigit))).fill(' ').join('');

            return `${prefix}${errorLineNumber === id ? '>' : ' '} ${id + 1}|${line}`;
        }).join('\n');

        console.error(`Error compiling shader:\n${formattedSrc}\n\n${error}`);
    },
    createShader: (gl, source, type) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            ShaderUtils.displayError(source, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    },
    createProgram: (gl, vertexShader, fragmentShader, debug) => {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.bindAttribLocation(program, GL_ATTR_MAP.position.location, GL_ATTR_MAP.position.name);
        gl.bindAttribLocation(program, GL_ATTR_MAP.normal.location, GL_ATTR_MAP.normal.name);
        gl.bindAttribLocation(program, GL_ATTR_MAP.uv.location, GL_ATTR_MAP.uv.name);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Error creating shader program:\n${gl.getProgramInfoLog(program)}`);
            gl.deleteProgram(program);
            return null;
        }

        if (debug) {
            gl.validateProgram(program);
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                console.error(`Error validating shader program:\n${gl.getProgramInfoLog(program)}`);
                gl.deleteProgram(program);
                return null;
            }
        }

        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    },
    getStandardAttributeLocation: (gl,program) => ({
        position: gl.getAttribLocation(program, GL_ATTR_MAP.position.name),
        norm: gl.getAttribLocation(program, GL_ATTR_MAP.normal.name),
        uv: gl.getAttribLocation(program, GL_ATTR_MAP.uv.name)
    }),
    getStandardUniformLocation: (gl, program) => ({
        perspective: gl.getUniformLocation(program, 'uPMatrix'),
        modelMatrix: gl.getUniformLocation(program, 'uMVMatrix'),
        cameraMatrix: gl.getUniformLocation(program, 'uCameraMatrix'),
        mainTexture: gl.getUniformLocation(program, 'uMainTexture'),
        color: gl.getUniformLocation(program, 'uColor')
    })
};
