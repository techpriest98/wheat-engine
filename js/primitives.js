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
    },
    World: class {
        #chunk = [];
        #gl;
        #size;

        constructor(gl, chunk, size) {
            this.#chunk = chunk;
            this.#size = size;
            this.#gl = gl;
        }

        getPoint = (x, y, z) => {
            const index = (z * this.#size * this.#size) + (y * this.#size) + x;
            return this.#chunk[index];
        };

        setPoint = (x, y, z, value) => {
            this.#chunk[(z * this.#size * this.#size) + (y * this.#size) + x] = value;
        };

        march = () => {
            const meshes = [];
            for(let x = 0; x < this.#size - 1; x++) {
                for (let z = 0; z < this.#size - 1; z++) {
                    for (let y = 0; y < this.#size - 1; y++) {
                        meshes.push(this.buildCube(x, y, z));
                    }
                }
            }
            return meshes;
        };

        buildCube = (x, y, z) => {
            let i = 0;
            const vertices = MARCHING_CUBE.vertices.map((point) => {
                i++;
                const buff = i - 1;
                if (i > 2) i = 0;
                switch (buff) {
                    case 0:
                        return point + x;
                    case 1:
                        return point + y;
                    case 2:
                        return point + z;
                }

            });

            const points = [
                this.getPoint(x, y, z),
                this.getPoint(x + 1, y, z),
                this.getPoint(x, y + 1, z),
                this.getPoint(x + 1, y + 1, z),
                this.getPoint(x, y, z + 1),
                this.getPoint(x + 1, y, z + 1),
                0, //this.getPoint(x + 1, y + 1, z + 1),
                0, //this.getPoint(x, y + 1, z + 1),
            ];

            const indices = MARCHING_CUBE.table[MARCHING_CUBE.triangulate(points)];
            const mesh = this.#gl.createMeshVAO(`${x}${y}${z}`, {vertices, indices});
            mesh.noCulling = false;
            return mesh;
        }
    }
};

const MARCHING_CUBE = {
    vertices: [
        0.5, 0, 0,
        1, 0, 0.5,
        0.5, 0, 1,
        0, 0, 0.5,
        0.5, 1, 0,
        1, 1, 0.5,
        0.5, 1, 1,
        0, 1, 0.5,
        0, 0.5, 0,
        1, 0.5, 0,
        1, 0.5, 1,
        0, 0.5, 1
    ],
    table: [
        [],
        [11, 3, 2], // 00000001
        [10, 2, 1], // 00000010
        [11, 3, 1, 1, 10, 11], // 00000011
        [7, 11, 6], // 00000100
        [6, 7, 3, 3, 2, 6], // 00000101
        [7, 11, 6, 10, 2, 1], //00000110
        [7, 3, 1, 1, 10, 7, 7, 10, 6], // 00000111
        [6, 10, 5], //00001000
        [11, 3, 2, 6, 10, 5], //00001001
        [5, 6, 2, 2, 1, 5], //00001010
        [1, 5, 3, 3, 5, 11, 5, 6, 11], // 00001011
        [5, 7, 11, 11, 10, 5], // 00001100,
        [5, 7, 3, 5, 3, 10, 10, 3, 2], // 00001101,
        [5, 7, 1, 7, 11, 1, 11, 2, 1], // 00001110
        [5, 7, 3, 3, 1, 5], // 00001111
        [3, 8, 0], // 00010000
        [2, 11, 8, 8, 0, 2], // 00010001
        [3, 8, 0, 10, 2, 1], // 00010010
        [11, 8, 10, 8, 0, 1, 1, 10, 8], //00010011
        [3, 8, 0, 7, 11, 6], // 00010100
        [2, 6, 4, 4, 8, 2, 8, 3, 2], // 00010101
        [3, 8, 0, 7, 11, 6, 10, 2, 1], // 00010110
        [10, 6, 7, 7, 1, 10, 1, 7, 8, 8, 0, 1], // 00010111
        [3, 8, 0, 6, 10, 5], // 00011000
        [11, 8, 0, 0, 2, 11, 6, 10, 5], //00011001
        [3, 8, 0, 5, 6, 2, 2, 1, 5], // 00011010
        [5, 6, 11, 5, 11, 0, 11, 8, 0, 0, 1, 5], // 00011011
        [3, 8, 0, 5, 7, 11, 11, 10, 5], //00011100
        [10, 5, 7, 8, 0, 2, 10, 8, 2, 10, 7, 8], //00011101
        [3, 8, 0, 1, 5, 7, 1, 7, 11, 1, 11, 2], //00011110
        [7, 8, 0, 1, 5, 7, 0, 1, 7], //00011111
        [0, 9, 1], //00100000
        [0, 9, 1, 11, 3, 2], //00100001
        [10, 2, 0, 0, 9, 10], //00100010
        [10, 11, 9, 11, 0, 9, 3, 0, 11], //00100011
        [0, 9, 1, 7, 11, 6], //00100100
        [6, 7, 3, 3, 2, 6, 0, 9, 1], //00100101
        [10, 2, 0, 0, 9, 10, 7, 11, 6], //00100110
        [], //00100111
    ],
    triangulate: (points) => {
        const binary = points.reduce((acc, point) => point.toString() + acc, '');
        return parseInt(binary, 2);
    }
};
