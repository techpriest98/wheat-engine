import {GL} from '../../gl.js';

import {RenderLoop} from "../../render-loop.js";
import {Camera, CameraController} from "../../camera.js";
import {ObjLoader} from '../../obj-loader.js';
import {Primitives} from "../../primitives.js";

import {GridAxisShader} from "../../shaders/grid-axis.shader.js";
import {OpaqueColorShader} from "../../shaders/opaque-color.shader.js";
import {SkyMapShader} from "../../shaders/skymap.shader.js";
import {Model} from "../../model.js";

export const MarchingCubesScene = {
    name: 'Marching Cubes',
    init: () => {
        const gl = GL('gl-canvas').fFitScreen().fClear();

        const camera = new Camera(gl);
        camera.transform.setPosition(0, 0.5, 2);
        CameraController(gl, camera);

        const checkerTexture = gl.fLoadTexture('checker', document.querySelector('#img-checker'));
        const skyTexture = gl.fLoadCubeMap('skybox0', [
            document.querySelector('#cube0-right'),
            document.querySelector('#cube0-left'),
            document.querySelector('#cube0-top'),
            document.querySelector('#cube0-bottom'),
            document.querySelector('#cube0-front'),
            document.querySelector('#cube0-back')
        ]);

        const gridShader = new GridAxisShader(gl, camera.projectionMatrix);
        const skyMapShader = new SkyMapShader(gl, camera.projectionMatrix, skyTexture);
        const worldShader = new OpaqueColorShader(gl, camera.projectionMatrix).setTexture(checkerTexture);

        const gridModel = Primitives.grid(true, true).createModel(gl);

        const skyMap = Primitives.SkyMap.createModel(gl, 'Skymap', 10);
        skyMap.transform.setScale(100, 100, 100);

        const worldModels = new Primitives.World(gl, [
            0, 1, 1, 0, 0, 1, 0, 0
        ], 2).march().map(mesh => new Model(mesh));

        const onRender = deltaTime => {
            camera.updateViewMatrix();
            gl.fClear();

            skyMapShader
                .activate()
                .preRender()
                .setCameraMatrix(camera.getTranslatesMatrix(camera.viewMatrix))
                .renderModel(skyMap);
            gridShader
                .activate()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(gridModel.preRender());
            worldShader.activate()
                .setCameraMatrix(camera.viewMatrix);
            worldModels.forEach(model => {
                worldShader.renderModel(model.preRender())
            });
        };

        const renderLoop = RenderLoop(onRender, 60);
        renderLoop.start();

        return () => {
            renderLoop.stop();
            gl.fClearMeshCache();
            skyMapShader.deactivate();
            gridShader.deactivate();
            worldShader.deactivate();
        }
    }
};
