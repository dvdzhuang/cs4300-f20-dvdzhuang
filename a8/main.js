const main = () => {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    const shaderProgram = initializeShaderProgram(gl)
    const parameters = getProgramParameters(gl, shaderProgram);

    const buffers = initializeBuffers(gl)

    const texture = loadTexture(gl, './rubics.png');

    let then = 0;
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, parameters, buffers, deltaTime, texture);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}