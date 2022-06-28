export class ObjLoader {
    static readSingleFile = (e, onRead) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = readerEvent => {
            onRead(readerEvent.target.result)
        }
    };
    static parse = (gl, name, file, flipUV) => {
        let i = 0;
        let ind = 0;
        let indexCount = 0;
        const vertices = [];
        const uvs = [];
        const normals = [];
        const cache = {};

        const lines = file.split('\n');
        const meshData = {
            vertices: [],
            normals: [],
            uvs: [],
            indices: []
        };

        lines.forEach(line => {
            if(line[0] === 'v') {
                switch (line[1]) {
                    case ' ':
                        const vBuffer = line.split(' ');
                        vertices.push(parseFloat(vBuffer[1]), parseFloat(vBuffer[2]), parseFloat(vBuffer[3]));
                        break;
                    case 't':
                        const tBuffer = line.split(' ');
                        uvs.push(parseFloat(tBuffer[1]), parseFloat(tBuffer[2]));
                        break;
                    case 'n':
                        const nBuffer = line.split(' ');
                        normals.push(parseFloat(nBuffer[1]), parseFloat(nBuffer[2]), parseFloat(nBuffer[3]));
                        break;
                }
            } else if (line[0] === 'f') {
                const fBuffer = line.split(' ').splice(1);
                let isQuad = false;

                for (i = 0; i < fBuffer.length; i++) {
                    if (i === 3 && !isQuad) {
                        i = 2;
                        isQuad = true;
                    }

                    if (fBuffer[i] in cache) {
                        meshData.indices.push(cache[fBuffer[i]]);
                    } else {
                        const pointData = fBuffer[i].split('/');

                        ind = (parseInt(pointData[0]) - 1) * 3;
                        meshData.vertices.push(vertices[ind], vertices[ind + 1], vertices[ind + 2]);

                        ind = (parseInt(pointData[2]) - 1) * 3;
                        meshData.normals.push(normals[ind], normals[ind + 1], normals[ind + 2]);

                        if (pointData[1] !== '') {
                            ind = (parseInt(pointData[1]) - 1) * 2;
                            meshData.uvs.push(uvs[ind], !flipUV ? uvs[ind + 1] : 1 - uvs[ind + 1]);
                        }

                        cache[fBuffer[i]] = indexCount;
                        meshData.indices.push(indexCount);
                        indexCount++;
                    }

                    if (i === 3 && isQuad) {
                        meshData.indices.push(cache[fBuffer[0]]);
                    }
                }
            }
        });

        const mesh = gl.createMeshVAO(name, meshData, true);
        gl.mMeshCache[name] = mesh;

        return mesh;
    };
}