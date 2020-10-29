const up = [0, 1, 0]
let target = [0, 0, 0]
let lookAt = true

let gl
let attributeCoords
let uniformMatrix
let uniformColor
let bufferCoords

let attributeNormals
let uniformWorldViewProjection
let uniformWorldInverseTranspose
let uniformReverseLightDirectionLocation
let normalBuffer

const init = () => {
    // get a reference to the canvas and WebGL context
    const canvas = document.querySelector("#canvas");

    canvas.addEventListener(
        "mousedown",
        webglUtils.doMouseDown,
        false);

    gl = canvas.getContext("webgl");

    // create and use a GLSL program
    const program = webglUtils.createProgramFromScripts(gl, "#vertex-shader-3d", "#fragment-shader-3d");
    gl.useProgram(program);

    // get reference to GLSL attributes and uniforms
    attributeCoords = gl.getAttribLocation(program, "a_coords");
    const uniformResolution = gl.getUniformLocation(program, "u_resolution");
    uniformColor = gl.getUniformLocation(program, "u_color");
    uniformMatrix = gl.getUniformLocation(program, "u_matrix");

    // initialize coordinate attribute to send each vertex to GLSL program
    gl.enableVertexAttribArray(attributeCoords);

    // initialize coordinate buffer to send array of vertices to GPU
    bufferCoords = gl.createBuffer();

    attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.enableVertexAttribArray(attributeNormals);
    normalBuffer = gl.createBuffer();

    uniformWorldViewProjection = gl.getUniformLocation(program, "u_worldViewProjection");
    uniformWorldInverseTranspose = gl.getUniformLocation(program, "u_worldInverseTranspose");
    uniformReverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

    // configure canvas resolution and clear the canvas
    gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    document.getElementById("tx").onchange = event => updateTranslation(event, "x")
    document.getElementById("ty").onchange = event => updateTranslation(event, "y")
    document.getElementById("tz").onchange = event => updateTranslation(event, "z")

    document.getElementById("sx").onchange = event => updateScale(event, "x")
    document.getElementById("sy").onchange = event => updateScale(event, "y")
    document.getElementById("sz").onchange = event => updateScale(event, "z")

    document.getElementById("rx").onchange = event => updateRotation(event, "x")
    document.getElementById("ry").onchange = event => updateRotation(event, "y")
    document.getElementById("rz").onchange = event => updateRotation(event, "z")

    document.getElementById("fv").onchange = event => updateFieldOfView(event)

    document.getElementById("color").onchange = event => updateColor(event)

    document.getElementById("lookAt").onchange = event => webglUtils.toggleLookAt(event)
    document.getElementById("ctx").onchange = event => webglUtils.updateCameraTranslation(event, "x")
    document.getElementById("cty").onchange = event => webglUtils.updateCameraTranslation(event, "y")
    document.getElementById("ctz").onchange = event => webglUtils.updateCameraTranslation(event, "z")
    document.getElementById("crx").onchange = event => webglUtils.updateCameraRotation(event, "x")
    document.getElementById("cry").onchange = event => webglUtils.updateCameraRotation(event, "y")
    document.getElementById("crz").onchange = event => webglUtils.updateCameraRotation(event, "z")
    document.getElementById("ltx").onchange = event => webglUtils.updateLookAtTranslation(event, 0)
    document.getElementById("lty").onchange = event => webglUtils.updateLookAtTranslation(event, 1)
    document.getElementById("ltz").onchange = event => webglUtils.updateLookAtTranslation(event, 2)

    document.getElementById("lookAt").checked = lookAt
    document.getElementById("ctx").value = camera.translation.x
    document.getElementById("cty").value = camera.translation.y
    document.getElementById("ctz").value = camera.translation.z
    document.getElementById("crx").value = camera.rotation.x
    document.getElementById("cry").value = camera.rotation.y
    document.getElementById("crz").value = camera.rotation.z

    document.getElementById("dlrx").value = lightSource[0]
    document.getElementById("dlry").value = lightSource[1]
    document.getElementById("dlrz").value = lightSource[2]

    document.getElementById("dlrx").onchange = event => webglUtils.updateLightDirection(event, 0)
    document.getElementById("dlry").onchange = event => webglUtils.updateLightDirection(event, 1)
    document.getElementById("dlrz").onchange = event => webglUtils.updateLightDirection(event, 2)

    webglUtils.selectShape(0)
}

let fieldOfViewRadians = m4.degToRad(60)
const computeModelViewMatrix = (shape, viewProjectionMatrix) => {
    M = m4.translate(viewProjectionMatrix, shape.translation.x, shape.translation.y, shape.translation.z)
    M = m4.xRotate(M, m4.degToRad(shape.rotation.x))
    M = m4.yRotate(M, m4.degToRad(shape.rotation.y))
    M = m4.zRotate(M, m4.degToRad(shape.rotation.z))
    M = m4.scale(M, shape.scale.x, shape.scale.y, shape.scale.z)
    return M
}

const render = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    gl.vertexAttribPointer(attributeCoords, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(attributeNormals, 3, gl.FLOAT, false, 0, 0);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);

    let cameraMatrix = m4.identity()

    if (lookAt) {
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z)
        const cameraPosition = [
            cameraMatrix[12],
            cameraMatrix[13],
            cameraMatrix[14]]
        cameraMatrix = m4.lookAt(
            cameraPosition,
            target, up)
        cameraMatrix = m4.inverse(cameraMatrix)
    } else {
        cameraMatrix = m4.zRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.z));
        cameraMatrix = m4.xRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.x));
        cameraMatrix = m4.yRotate(
            cameraMatrix,
            m4.degToRad(camera.rotation.y));
        cameraMatrix = m4.translate(
            cameraMatrix,
            camera.translation.x,
            camera.translation.y,
            camera.translation.z);
    }

    const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
    const viewProjectionMatrix = m4.multiply(projectionMatrix, cameraMatrix)

    let worldMatrix = m4.identity()
    const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    const worldInverseMatrix = m4.inverse(worldMatrix);
    const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    gl.uniformMatrix4fv(uniformWorldViewProjection, false, worldViewProjectionMatrix);
    gl.uniformMatrix4fv(uniformWorldInverseTranspose, false, worldInverseTransposeMatrix);

    gl.uniform3fv(uniformReverseLightDirectionLocation, m4.normalize(lightSource));

    shapes.forEach(shape => {
        gl.uniform4f(uniformColor, shape.color.red, shape.color.green, shape.color.blue, 1);

        let M = computeModelViewMatrix(shape, worldViewProjectionMatrix)
        gl.uniformMatrix4fv(uniformWorldViewProjection, false, M);

        if (shape.type === RECTANGLE) {
            webglUtils.renderRectangle(shape)
        } else if (shape.type === TRIANGLE) {
            webglUtils.renderTriangle(shape)
        } else if (shape.type === CIRCLE) {
            renderCircle(shape)
        } else if (shape.type === STAR) {
            renderStar(shape)
        } else if (shape.type === CUBE) {
            webglUtils.renderCube(shape)
        }
    })

    const $shapeList = $("#object-list")
    $shapeList.empty()
    shapes.forEach((shape, index) => {
        const $li = $(`
        <li>
            <label>
                <input
                type="radio"
                id="${shape.type}-${index}"
                name="shape-index"
                ${index === selectedShapeIndex ? "checked" : ""}
                onclick="selectShape(${index})"
                value="${index}"/>
            </label>
            <button onclick="deleteShape(${index})">
                Delete
            </button>
            <label>
                ${shape.type};
                X: ${shape.translation.x};
                Y: ${shape.translation.y}
            </label>
        </li>
        `)
        $shapeList.append($li)
    })
}

const renderCircle = (circle) => {
    var array = new Float32Array(900)
    const rad = circle.dimensions.width / 2
    const x = circle.position.x
    const y = circle.position.y

    for (i = 0; i < 100; i++) {
        array[9 * i] = (Math.fround(x + rad * Math.cos(Math.PI * 2 * i / 100)))
        array[9 * i + 1] = (Math.fround(y + rad * Math.sin(Math.PI * 2 * i / 100)))
        array[9 * i + 2] = 0
        array[9 * i + 3] = (Math.fround(x + rad * Math.cos(Math.PI * 2 * i / 100 + 2 * Math.PI / 3)))
        array[9 * i + 4] = (Math.fround(y + rad * Math.sin(Math.PI * 2 * i / 100 + 2 * Math.PI / 3)))
        array[9 * i + 5] = 0
        array[9 * i + 6] = (Math.fround(x + rad * Math.cos(Math.PI * 2 * i / 100 - 2 * Math.PI / 3)))
        array[9 * i + 7] = (Math.fround(y + rad * Math.sin(Math.PI * 2 * i / 100 - 2 * Math.PI / 3)))
        array[9 * i + 8] = 0
    }

    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 300);
}

const renderStar = (star) => {
    const x1 = star.position.x - star.dimensions.width / 2
    const y1 = star.position.y + star.dimensions.height / 3
    const x2 = star.position.x + star.dimensions.width / 2
    const y2 = star.position.y + star.dimensions.height / 3
    const x3 = star.position.x
    const y3 = star.position.y - star.dimensions.height * 2 / 3
    const x4 = star.position.x - star.dimensions.width / 2
    const y4 = star.position.y - star.dimensions.height / 3
    const x5 = star.position.x + star.dimensions.width / 2
    const y5 = star.position.y - star.dimensions.height / 3
    const x6 = star.position.x
    const y6 = star.position.y + star.dimensions.height * 2 / 3

    const float32Array = new Float32Array([
        x1, y1, 0, x3, y3, 0, x2, y2, 0, x4, y4, 0, x5, y5, 0, x6, y6, 0
    ])

    gl.bufferData(gl.ARRAY_BUFFER, float32Array, gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}

let selectedShapeIndex = 0