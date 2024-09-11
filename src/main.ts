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

void main(){  
  gl_Position = vec4(a_position,0.0,1.0);
}
`

const fs = `#version 300 es

precision highp float;

out vec4 outColor; 

void main(){
  outColor = vec4(1.0,0.0,0.0,1.0);
}
`

// Program
const program = createProgram(gl, vs, fs)

// Location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position")

// buffer
const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

// vertex array object
const vao = gl.createVertexArray()
gl.bindVertexArray(vao)

// vertex attrib
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionAttributeLocation)




// program use
gl.useProgram(program)
gl.bindVertexArray(vao)

// Buffer
const positions = [
  0, 0,
  0.5, 0.5,
  0.5, 1,
  1, 1,
  -1, 1,
  -1, -1
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

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
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Error compiling shader. Info: " + gl.getShaderInfoLog(shader))

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


