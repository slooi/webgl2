import './style.css'

// canvas
const canvas = document.createElement("canvas")
canvas.width = 300
canvas.height = 300
document.querySelector("body")?.append(canvas)

// gl
let gl = canvas.getContext("webgl2")
if (!gl) throw new Error("webgl not supported. Info: " + gl)

// shaders
const vs = `#version 300 es

in vec2 a_position;
in vec4 a_color;

uniform vec2 u_res;

out vec4 v_color;

void main(){
  v_color = a_color;
  gl_Position = vec4(2.0*a_position.x/u_res.x-1.0,2.0*-a_position.y/u_res.y+1.0,0.0,1.0);
}
`

const fs = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor; 

void main(){
  outColor = v_color;
}
`

// Program
const program = createProgram(gl, vs, fs)

// Location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
const resUniformLocation = gl.getUniformLocation(program, "u_res")
const colorAttributeLocation = gl.getAttribLocation(program, "a_color")

// buffer
const positionBuffer = gl.createBuffer()
const colorBuffer = gl.createBuffer()

// vertex array object
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// vertex attrib
// POSITION
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionAttributeLocation)

// COLOR
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0)
gl.enableVertexAttribArray(colorAttributeLocation)


// program use
gl.useProgram(program)
gl.uniform2fv(resUniformLocation, [gl.canvas.width, gl.canvas.height]);
gl.bindVertexArray(vao)

// Buffer
const positions = [
  0, 0,
  300, 0,
  295, 300 / 10,
]
const colors = [
  255, 0, 0, 255,
  255, 0, 0, 255,
  255, 0, 0, 255,
]
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

// enable
gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2)


/* 
      WEBGL FUNCTIONS
*/

function createShader(gl: WebGLRenderingContext, source: string, shaderType: typeof gl.VERTEX_SHADER | typeof gl.FRAGMENT_SHADER) {
  const shader = gl.createShader(shaderType)
  if (!shader) throw new Error("ERROR create shader")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  // TEST
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`Error compiling shader. Shader type: ${shaderType} Info: ` + gl.getShaderInfoLog(shader))

  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const program = gl.createProgram()
  if (!program) throw new Error("ERROR create program")
  gl.attachShader(program, createShader(gl, vs, gl.VERTEX_SHADER))
  gl.attachShader(program, createShader(gl, fs, gl.FRAGMENT_SHADER))
  gl.linkProgram(program)
  gl.validateProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("ERROR: linking program. Info: " + gl.getProgramInfoLog(program))
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) throw new Error("ERROR: validating program. Info: " + gl.getProgramInfoLog(program))

  return program
}


