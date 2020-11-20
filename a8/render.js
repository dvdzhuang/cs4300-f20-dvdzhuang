let squareRotation = 0.0;

const drawScene = (gl, parameters, buffers, deltaTime, texture) => {
    clearScene(gl);
    const projectionMatrix = createProjectionMatrix(gl);
    const modelViewMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );

    glMatrix.mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        squareRotation,
        [0, 0, 1]
    );

    glMatrix.mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        squareRotation * .7,
        [0, 1, 0]
    );

    squareRotation += deltaTime;

    configurePositionBufferRead(gl, buffers, parameters);
    configureTextureBufferRead(gl, buffers, parameters);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(parameters.uniformLocations.uSampler, 0);

    gl.useProgram(parameters.program);
    setUniforms(gl, parameters, projectionMatrix, modelViewMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(
        gl.TRIANGLES,
        36,
        gl.UNSIGNED_SHORT,
        0
    );
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
        parameters.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
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

const configureTextureBufferRead = (gl, buffers, parameters) => {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(parameters.attribLocations.textureCoord,
        num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(parameters.attribLocations.textureCoord);
}