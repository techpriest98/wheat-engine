const CANVAS_ID_UNDEFINED = 'Property csnvasId is undefined';
const CANVAS_NOT_FOUND_ERROR = 'Canvas element is not found';
const WEBGL_CONTEXT_NOT_AVAILABLE = 'WebGL Context is not available';

export const GL_ATTR_MAP = {
    position: {
        name: 'a_position',
        location: 0
    },
    normal: {
        name: 'a_normal',
        location: 1
    },
    uv: {
        name: 'a_uv',
        location: 2
    }
};

export const GL = canvasId => {
    if (!canvasId) {
        console.error(CANVAS_ID_UNDEFINED);
        return null;
    }

    const canvas = document.querySelector(`#${canvasId}`);

    if (!canvas) {
        console.error(CANVAS_NOT_FOUND_ERROR);
        return null;
    }

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error(WEBGL_CONTEXT_NOT_AVAILABLE);
        return null;
    }

    gl.mMeshCache = {};
    gl.mTextureCache = {};

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CW);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    gl.fClearMeshCache = () => {
        gl.mMeshCache = {};
    };

    gl.fClear = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return gl;
    };

    gl.fSetScreenSize = (screenWidth, screenHeight) => {
        canvas.style = {
            ...canvas.style,
            width: `${screenWidth}px`,
            height: `${screenHeight}px`
        };
        canvas.width = screenWidth;
        canvas.height = screenHeight;

        gl.viewport(0, 0, screenWidth, screenHeight);
        return gl;
    };

    gl.fFitScreen = () => gl.fSetScreenSize(window.innerWidth, window.innerHeight);

    gl.fCreateArrayBuffer = (floatArray, isStatic = true) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, floatArray, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    };

    gl.createMeshVAO = (name, {vertices, normals, indices, uvs}, ccw = false, drawMode = gl.TRIANGLES) => {
        let result = {};

        result.drawMode = drawMode;
        result.ccw = ccw;
        result.vao = gl.createVertexArray();
        gl.bindVertexArray(result.vao);

        if (vertices) {
            result.buffVertices = gl.createBuffer();
            result.vertexComponentLen = 3;
            result.vertexCount = vertices.length / 3;

            gl.bindBuffer(gl.ARRAY_BUFFER, result.buffVertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(GL_ATTR_MAP.position.location);
            gl.vertexAttribPointer(GL_ATTR_MAP.position.location, 3, gl.FLOAT, false, 0,0);
        }

        if (normals) {
            result.buffNormals = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, result.buffNormals);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(GL_ATTR_MAP.normal.location);
            gl.vertexAttribPointer(GL_ATTR_MAP.normal.location, 3, gl.FLOAT, false, 0,0);
        }

        if (uvs) {
            result.buffUVs = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, result.buffUVs);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(GL_ATTR_MAP.uv.location);
            gl.vertexAttribPointer(GL_ATTR_MAP.uv.location, 2, gl.FLOAT, false, 0,0);
        }

        if (indices) {
            result.buffIndices = gl.createBuffer();
            result.indexCount = indices.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.buffIndices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        }


        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.mMeshCache[name] = result;
        return result;
    };

    gl.fLoadTexture = (name, img, doYFlip) => {
        const texture = gl.createTexture();
        if (doYFlip) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.mTextureCache[name] = texture;

        if (doYFlip) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        }

        return texture;
    };

    gl.fLoadCubeMap = (name, imgArray) => {
        if (!imgArray || !imgArray.length) {
            return null;
        }

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        imgArray.forEach((image, i) => {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        });

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        gl.mTextureCache[name] = texture;
        return texture;
    };

    return gl;
};
