import {GL} from '../../gl.js';

import {RenderLoop} from "../../render-loop.js";
import {Camera, CameraController} from "../../camera.js";
import {ObjLoader} from '../../obj-loader.js';
import {Primitives} from "../../primitives.js";

import {GridAxisShader} from "../../shaders/grid-axis.shader.js";
import {OpaqueColorShader} from "../../shaders/opaque-color.shader.js";
import {SkyMapShader} from "../../shaders/skymap.shader.js";
import {QuadShader} from "../../shaders/quad.shader.js";
import {Model} from "../../model.js";

export const CubesScene = {
    name: 'Cubes',
    init: () => {
        const gl = GL('gl-canvas').fFitScreen().fClear();

        const camera = new Camera(gl);
        camera.transform.setPosition(0, 0.5, 2);
        CameraController(gl, camera);

        const boxTexture = gl.fLoadTexture('tex001', document.querySelector('#img-box'));
        const checkerTexture = gl.fLoadTexture('checker', document.querySelector('#img-checker'));
        const grassTexture = gl.fLoadTexture('grass', document.querySelector('#img-grass'));
        const skyTexture = gl.fLoadCubeMap('skybox0', [
            document.querySelector('#cube0-right'),
            document.querySelector('#cube0-left'),
            document.querySelector('#cube0-top'),
            document.querySelector('#cube0-bottom'),
            document.querySelector('#cube0-front'),
            document.querySelector('#cube0-back')
        ]);

        const gridShader = new GridAxisShader(gl, camera.projectionMatrix);
        const quadShader = new QuadShader(gl, camera.projectionMatrix).setTexture(grassTexture);
        const skyMapShader = new SkyMapShader(gl, camera.projectionMatrix, skyTexture);
        const cubeShader = new OpaqueColorShader(gl, camera.projectionMatrix)
            .setTexture(boxTexture);
        const objShader = new OpaqueColorShader(gl, camera.projectionMatrix).setTexture(checkerTexture);

        const gridModel = Primitives.grid(true, true).createModel(gl);

        const skyMap = Primitives.SkyMap.createModel(gl, 'Skymap', 10);
        skyMap.transform.setScale(100, 100, 100);

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

        let loadedObj;
        document.querySelector('#file-input').addEventListener('change', e => {
            ObjLoader.readSingleFile(e, file => {
                loadedObj = new Model(ObjLoader.parse(gl, 'obj', file, false));
                loadedObj.transform
                    .setScale(0.4, 0.4, 0.4)
                    .setPosition(1, 1, 1);
            });
        }, false);

        const quad1 = Primitives.quad.createModel(gl, true, true);
        quad1.transform
            .setScale(0.3, 0.3, 0.3)
            .setPosition(0.1, 0.3, -0.1);

        const quad2 = new Model(gl.mMeshCache['Quad']);
        quad2.transform
            .setScale(0.3, 0.3, 0.3)
            .setPosition(0.1, 0.3, -0.1)
            .setRotation(0, 90, 0);

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
            cubeShader
                .activate()
                .preRender()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(cube.preRender())
                .renderModel(cube1.preRender())
                .renderModel(cube2.preRender());
            quadShader
                .activate()
                .preRender()
                .setCameraMatrix(camera.viewMatrix)
                .renderModel(quad1.preRender())
                .renderModel(quad2.preRender());
            if (loadedObj) {
                objShader
                    .activate()
                    .preRender()
                    .setCameraMatrix(camera.viewMatrix)
                    .renderModel(loadedObj.preRender());
            }
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
