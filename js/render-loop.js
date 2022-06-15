export const RenderLoop = (callback, fps) => {
    let state = {
        msLastFrame: 0,
        isActive: false,
        run: null,
        fps: fps
    };

    if(state.fps && state.fps > 0) {
        const msFpsLimit = 1000 / fps;

        state.run = () => {
            const msCurrent = performance.now(),
                msDelta = msCurrent - state.msLastFrame,
                deltaTime = msDelta / 1000.0;

            if (msDelta >= msFpsLimit) {
                state.fps = Math.floor(1 / deltaTime);
                state.msLastFrame = msCurrent;
                callback(deltaTime);
            }

            if (state.isActive) {
                window.requestAnimationFrame(state.run);
            }
        }
    } else {
        state.run = () => {
            const msCurrent = performance.now(),
                deltaTime = (msCurrent - state.msLastFrame) / 1000.0;

            state.fps = Math.floor(1 / deltaTime);
            state.msLastFrame = msCurrent;
            callback(deltaTime);

            if (state.isActive) {
                window.requestAnimationFrame(state.run);
            }
        }
    }

    const start = () => {
        state.isActive = true;
        state.msLastFrame = performance.now();
        window.requestAnimationFrame(state.run);
    };

    const stop = () => {
        state.isActive = false;
    };

    return {start, stop};
};