const main = () => {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    const shaderProgram = initializeShaderProgram(gl)
    const parameters = getProgramParameters(gl, shaderProgram);

    const buffers = initializeBuffers(gl)

    drawScene(gl, parameters, buffers)
}