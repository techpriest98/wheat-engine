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
        static createModel = gl => new Model(Primitives.quad.createMesh(gl));
        static createMesh = gl => {
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
            mesh.noCulling = false;
            mesh.doBlending = false;

            return mesh;
        };
    }

};