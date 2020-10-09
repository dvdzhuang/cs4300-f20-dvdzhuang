const webglUtils = {
    hexToRgb: (hex) => {
        let parseRgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let rgb = {
            red: parseInt(parseRgb[1], 16),
            green: parseInt(parseRgb[2], 16),
            blue: parseInt(parseRgb[3], 16)
        }
        rgb.red /= 256
        rgb.green /= 256
        rgb.blue /= 256
        return rgb
    },
    createProgramFromScripts: (gl, vertexShaderElementId, fragmentShaderElementId) => {
        // Get the strings for our GLSL shaders
        const vertexShaderSource = document.querySelector(vertexShaderElementId).text;
        const fragmentShaderSource = document.querySelector(fragmentShaderElementId).text;

        // Create GLSL shaders, upload the GLSL source, compile the shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        // Link the two shaders into a program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        return program
    },
    componentToHex: (c) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: (rgb) => {
        const redHex = webglUtils.componentToHex(rgb.red * 256)
        const greenHex = webglUtils.componentToHex(rgb.green * 256)
        const blueHex = webglUtils.componentToHex(rgb.blue * 256)
        return `#${redHex}${greenHex}${blueHex}`
    }
}