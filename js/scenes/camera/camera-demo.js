import {GL} from '../../gl.js';

import {RenderLoop} from "../../render-loop.js";
import {Camera, CameraController} from "../../camera.js";
import {Primitives} from "../../primitives.js";

import {GridAxisShader} from "../../shaders/grid-axis.shader.js";
import {QuadShader} from "../../shaders/quad.shader.js";

export const CameraDemo = {
    name: 'Camera',
    init: () => {
        const gl = GL('gl-canvas').fFitScreen().fClear();

        const camera = new Camera(gl);
        camera.transform.setPosition(0, 0.5, 2);
        CameraController(gl, camera);

        const gridShader = new GridAxisShader(gl, camera.projectionMatrix);
        const gridModel = Primitives.grid(true, true).createModel(gl);

        // const quadShader = new QuadShader(gl, camera.projectionMatrix);
        // const quadModel = Primitives.quad.createModel(gl);
        // quadModel.transform.setPosition(0, 1, 0);

        const onRender = deltaTime => {
            camera.updateViewMatrix();
            gl.fClear();
            gridShader
                .activate()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(gridModel.preRender());
            // quadShader
            //     .activate()
            //     .setCameraMatrix(camera.viewMatrix)
            //     .renderModel(quadModel.preRender());
        };

        const renderLoop = RenderLoop(onRender, 60);
        renderLoop.start();

        return () => {
            renderLoop.stop();
            gl.fClearMeshCache();
            gridShader.deactivate();
            //quadShader.deactivate();
        }
    }
};
