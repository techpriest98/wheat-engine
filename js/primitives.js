import {Model} from "./model.js";
import {GL_ATTR_MAP} from "./gl.js";

export const Primitives = {
    grid: (drawGrid, drawAxis) => {
        const grid = {};

        grid.createMesh = gl => {
            let vertices = [];

            if (drawGrid) {
                const size = 2;
                const div = 20;
                const step = size / div;
                const half = size / 2;

                let pos;
                for (let i = 0; i <= div; i++) {
                    pos = -half + (i * step);
                    vertices = [...vertices,
                        pos, 0, half, 0,
                        pos, 0, -half, 0
                    ];

                    pos = half - (i * step);
                    vertices = [...vertices,
                        -half, 0, pos, 0,
                        half, 0, pos, 0
                    ];
                }
            }

            if (drawAxis) {
                // x axis
                vertices = [...vertices,
                    -1, 0, 0, 1,
                    1, 0, 0, 1
                ];
                // y axis
                vertices = [...vertices,
                    0, -1, 0, 2,
                    0, 1, 0, 2
                ];
                // z axis
                vertices = [...vertices,
                    0, 0, -1, 3,
                    0, 0, 1, 3
                ];
            }

            const attrColorLoc = 4;
            const strideLen = Float32Array.BYTES_PER_ELEMENT * 4;
            const mesh = {
                drawMode: gl.LINES,
                vao: gl.createVertexArray(),
                vertexComponentLength: 4,
                vertexCount: vertices.length / 4,
                bufVertices: gl.createBuffer()
            };

            gl.bindVertexArray(mesh.vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(GL_ATTR_MAP.position.location);
            gl.enableVertexAttribArray(attrColorLoc);

            gl.vertexAttribPointer(GL_ATTR_MAP.position.location, 3, gl.FLOAT, false, strideLen, 0);
            gl.vertexAttribPointer(attrColorLoc, 1, gl.FLOAT, false, strideLen, Float32Array.BYTES_PER_ELEMENT * 3);

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.mMeshCache['grid'] = mesh;

            return mesh;
        };
        grid.createModel = gl => new Model(grid.createMesh(gl));

        return grid;
    },
    quad: class {
        static createModel = (gl, noCulling = false, doBlending = false) =>
            new Model(Primitives.quad.createMesh(gl, noCulling, doBlending));
        static createMesh = (gl, noCulling = false, doBlending = false) => {
            const vertices = [
                -1, 1, 0,
                -1, -1, 0,
                1, -1, 0,
                1, 1, 0
            ];
            const uvs = [
                0, 0,
                0, 1,
                1, 1,
                1, 0
            ];
            const indices = [
                0, 1, 2,
                2, 3, 0
            ];

            const mesh = gl.createMeshVAO('Quad', {vertices, indices, uvs});
            mesh.noCulling = noCulling;
            mesh.doBlending = doBlending;

            return mesh;
        };
    },
    Cube: class {
        static createModel = (gl, name = 'Cube') => new Model(Primitives.Cube.createMesh(gl, name));
        static createMesh = (gl, name) => {
            const vertices = [
                -0.5, -0.5, -0.5,   -0.5, -0.5, 0.5,   0.5, -0.5, 0.5,    0.5, -0.5, -0.5,
                0.5, 0.5, -0.5,     0.5, 0.5, 0.5,     -0.5, 0.5, -0.5,   0.5, 0.5, -0.5,
                -0.5, 0.5, 0.5,     0.5, 0.5, 0.5,     -0.5, 0.5, -0.5,   -0.5, 0.5, 0.5,
                0.5, 0.5, 0.5,      0.5, 0.5, -0.5
            ];
            const uvs = [
                0.5,0.25,   0.5, 0.5,    0.75, 0.5,   0.75, 0.25,
                1, 0.25,    1, 0.5,      0.5, 0,      0.75, 0,
                0.5, 0.75,  0.75, 0.75,  0.25, 0.25,  0.25, 0.5,
                0, 0.5,     0, 0.25
            ];
            const indices = [
                0,1,2,  2,3,0,
                3,2,5,  5,4,3,
                6,0,3,  3,7,6,
                1,8,9,  9,2,1,
                10,11,1,  1,0,10,
                13,12,11, 11,10,13
            ];

            const mesh = gl.createMeshVAO(name, {vertices, uvs, indices});
            mesh.noCulling = false;
            return mesh;
        }
    },
    SkyMap: class {
        static createModel = (gl, name = 'Skymap', scale = 1) => new Model(Primitives.SkyMap.createMesh(gl, name, scale));
        static createMesh = (gl, name, scale) => {
            const vertices = [
                -scale, -scale, -scale,   -scale, -scale, scale,   scale, -scale, scale,    scale, -scale, -scale,
                scale, scale, -scale,     scale, scale, scale,     -scale, scale, -scale,   scale, scale, -scale,
                -scale, scale, scale,     scale, scale, scale,     -scale, scale, -scale,   -scale, scale, scale,
                scale, scale, scale,      scale, scale, -scale
            ];
            const uvs = [
                0.5,0.25,   0.5, 0.5,    0.75, 0.5,   0.75, 0.25,
                1, 0.25,    1, 0.5,      0.5, 0,      0.75, 0,
                0.5, 0.75,  0.75, 0.75,  0.25, 0.25,  0.25, 0.5,
                0, 0.5,     0, 0.25
            ];
            const indices = [
                0,3,2,  2,1,0,
                3,4,5,  5,2,3,
                6,7,3,  3,0,6,
                1,2,9,  9,8,1,
                10,0,1, 1,11,10,
                13,10,11, 11,12,13
            ];

            const mesh = gl.createMeshVAO(name, {vertices, uvs, indices});
            mesh.noCulling = false;
            return mesh;
        }
    }
};