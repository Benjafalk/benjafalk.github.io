var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext('webgl');
if (!gl) {
    console.error("Unable to initialize WebGL.");
}

var time = 0.0;

var vertexSource = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

float getWaveGlow(vec2 pos, float radius, float intensity, float speed, float amplitude, float frequency, float shift) {
    float dist = abs(pos.y + amplitude * sin(shift + speed * time + pos.x * frequency));
    dist = 1.0 / dist;
    dist *= radius;
    dist = pow(dist, intensity);
    return dist;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float widthHeightRatio = resolution.x / resolution.y;
    vec2 centre = vec2(0.5, 0.5);
    vec2 pos = centre - uv;
    pos.y /= widthHeightRatio;

    float intensity = 1.5;
    float radius = 0.02;
    
    vec3 col = vec3(0.0);
    float dist = 0.0;

    dist = getWaveGlow(pos, radius, intensity, 2.0, 0.018, 3.7, 0.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(3.14 + time + vec3(0, 2, 4)));

    dist = getWaveGlow(pos, radius, intensity, 4.0, 0.018, 6.0, 2.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(1.57 + time + vec3(0, 2, 4)));

    dist = getWaveGlow(pos, radius * 0.5, intensity, -5.0, 0.018, 4.0, 1.0);
    col += dist * (vec3(0.1) + 0.5 + 0.5 * cos(time + vec3(0, 2, 4)));

    col = 1.0 - exp(-col);
    col = pow(col, vec3(0.4545));

    gl_FragColor = vec4(col, 1.0);
}
`;

// Compile shader function
function compileShader(shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
    }
    return shader;
}

var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

var vertexData = new Float32Array([
    -1.0,  1.0, 
    -1.0, -1.0, 
     1.0,  1.0, 
     1.0, -1.0,
]);

var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

var positionHandle = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 2 * 4, 0);

var timeHandle = gl.getUniformLocation(program, 'time');
var widthHandle = gl.getUniformLocation(program, 'width');
var heightHandle = gl.getUniformLocation(program, 'height');

gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(widthHandle, window.innerWidth);
    gl.uniform1f(heightHandle, window.innerHeight);
});

// Updated: Ensure loader hides after content is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none';
        document.body.classList.add('loaded');
    }, 500); // Adjust the delay as needed
});

var lastFrame = Date.now();
var thisFrame;

function draw() {
    thisFrame = Date.now();
    time += (thisFrame - lastFrame) / 3000;
    lastFrame = thisFrame;

    gl.uniform1f(timeHandle, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(draw);
}

draw();
