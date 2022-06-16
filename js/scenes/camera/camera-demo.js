import {GL} from '../../gl.js';

import {RenderLoop} from "../../render-loop.js";
import {Camera, CameraController} from "../../camera.js";
import {Primitives} from "../../primitives.js";

import {GridAxisShader} from "../../shaders/grid-axis.shader.js";
import {QuadShader} from "../../shaders/quad.shader.js";
import {Model} from "../../model.js";

export const CameraDemo = {
    name: 'Camera',
    init: () => {
        const gl = GL('gl-canvas').fFitScreen().fClear();

        const camera = new Camera(gl);
        camera.transform.setPosition(0, 0.5, 2);
        CameraController(gl, camera);

        const texture = gl.fLoadTexture('tex001', document.querySelector('#img-grass'));

        const gridShader = new GridAxisShader(gl, camera.projectionMatrix);
        const gridModel = Primitives.grid(true, true).createModel(gl);

        const quadShader = new QuadShader(gl, camera.projectionMatrix).setTexture(texture);
        const quad1 = Primitives.quad.createModel(gl, true, true);
        quad1.transform
            .setScale(0.4, 0.4, 0.4)
            .setPosition(0, 0.4, 0);

        const quad2 = new Model(gl.mMeshCache['Quad']);
        quad2.transform
            .setScale(0.4, 0.4, 0.4)
            .setPosition(0, 0.4, 0)
            .setRotation(0, 90, 0);

        const onRender = deltaTime => {
            camera.updateViewMatrix();
            gl.fClear();
            gridShader
                .activate()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(gridModel.preRender());
            quadShader
                .activate()
                .preRender()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(quad1.preRender())
                .renderModel(quad2.preRender());
        };

        const renderLoop = RenderLoop(onRender, 30);
        renderLoop.start();

        return () => {
            renderLoop.stop();
            gl.fClearMeshCache();
            gridShader.deactivate();
            quadShader.deactivate();
        }
    }
};
