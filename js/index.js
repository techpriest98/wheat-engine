import {CameraDemo} from "./scenes/camera/camera-demo.js";

const demos = [
    CameraDemo
];

window.addEventListener('load', () => {
    let unmountDemo;
    const demosControl = document.querySelector('#demos-container');

    demos.forEach(demo => {
        const demoButton = document.createElement('button');
        demoButton.textContent = demo.name;
        demoButton.onclick = () => {
            if (unmountDemo) {
                unmountDemo();
            }

            unmountDemo = demo.init();
        };
        demosControl.append(demoButton);
    });
});
