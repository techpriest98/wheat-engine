import {GL} from '../../gl.js';

import {RenderLoop} from "../../render-loop.js";
import {Camera, CameraController} from "../../camera.js";
import {Primitives} from "../../primitives.js";

import {GridAxisShader} from "../../shaders/grid-axis.shader.js";
import {OpaqueColorShader} from "../../shaders/opaque-color.shader.js";

export const CubesScene = {
    name: 'Cubes',
    init: () => {
        const gl = GL('gl-canvas').fFitScreen().fClear();

        const camera = new Camera(gl);
        camera.transform.setPosition(0, 0.5, 2);
        CameraController(gl, camera);

        const texture = gl.fLoadTexture('tex001', document.querySelector('#img-checker'));

        const gridShader = new GridAxisShader(gl, camera.projectionMatrix);
        const gridModel = Primitives.grid(true, true).createModel(gl);

        const cubeShader = new OpaqueColorShader(gl, camera.projectionMatrix, '#ffffff')
            .setTexture(texture);

        const cube = Primitives.Cube.createModel(gl);
        cube.transform
            .setScale(0.4, 0.4, 0.4)
            .setPosition(-0.4, 0.2, 0.2);
        const cube1 = Primitives.Cube.createModel(gl);
        cube1.transform
            .setScale(0.4, 0.4, 0.4)
            .setPosition(0, 0.2, 0.4);
        const cube2 = Primitives.Cube.createModel(gl);
        cube2.transform
            .setScale(0.4, 0.4, 0.4)
            .setRotation(0,45,0)
            .setPosition(-0.2, 0.6, 0.2);

        const onRender = deltaTime => {
            camera.updateViewMatrix();
            gl.fClear();
            gridShader
                .activate()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(gridModel.preRender());
            cubeShader
                .activate()
                .preRender('#ffffff')
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(cube.preRender())
                .renderModel(cube1.preRender())
                .renderModel(cube2.preRender())
        };

        const renderLoop = RenderLoop(onRender, 60);
        renderLoop.start();

        return () => {
            renderLoop.stop();
            gl.fClearMeshCache();
            gridShader.deactivate();
            cubeShader.deactivate();
        }
    }
};
