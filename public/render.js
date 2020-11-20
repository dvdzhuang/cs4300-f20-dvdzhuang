const drawScene = (gl, parameters, buffers) => {
    clearScene(gl);
    const projectionMatrix = createProjectionMatrix(gl);
    const modelViewMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );
    configurePositionBufferRead(gl, buffers, parameters);
    configureColorBufferRead(gl, buffers, parameters);
    gl.useProgram(parameters.program);
    setUniforms(gl, parameters, projectionMatrix, modelViewMatrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

const clearScene = (gl) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const createProjectionMatrix = (gl) => {
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glMatrix.mat4.create();

    glMatrix.mat4.perspective(
        projectionMatrix, fieldOfView,
        aspect, zNear, zFar
    );
    return projectionMatrix;
}

const configurePositionBufferRead = (gl, buffers, parameters) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        parameters.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(parameters.attribLocations.vertexPosition);
}

const setUniforms = (gl, parameters, projectionMatrix, modelViewMatrix) => {
    gl.uniformMatrix4fv(parameters.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(parameters.uniformLocations.modelViewMatrix, false, modelViewMatrix);
}

const configureColorBufferRead = (gl, buffers, parameters) => {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        parameters.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(parameters.attribLocations.vertexColor);
}