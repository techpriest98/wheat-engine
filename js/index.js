import {CameraDemo} from "./scenes/camera/camera-demo.js";
import {CubesScene} from './scenes/cubes/cubes.scene.js';

const scenes = [
    CameraDemo,
    CubesScene
];

window.addEventListener('load', () => {
    let unmountScene;
    const scenesControl = document.querySelector('#demos-container');

    scenes.forEach(scene => {
        const sceneButton = document.createElement('button');
        sceneButton.textContent = scene.name;
        sceneButton.onclick = () => {
            if (unmountScene) {
                unmountScene();
            }

            unmountScene = scene.init();
        };
        scenesControl.append(sceneButton);
    });
});
