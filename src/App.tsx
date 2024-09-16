import './App.css'
import React from 'react'

function App() {
  return (
    <>
      <canvas></canvas>
    </>
  )
}



// canvas
const canvas = document.querySelector("canvas") as HTMLCanvasElement
canvas.width = 300
canvas.height = 300
// document.querySelector("body")?.append(canvas)

// gl
let gl = canvas.getContext("webgl2")
if (!gl) throw new Error("webgl not supported. Info: " + gl)

// shaders
const vs = `#version 300 es

in vec2 a_position;
in vec4 a_color;

uniform mat3 u_matrix;

out vec4 v_color;

void main(){
  v_color = a_color;
  gl_Position = vec4((u_matrix*vec3(a_position,1.0)).xy,0.0,1.0);
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


const m3 = {
  identity: () => {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ])
  },
  scale: (scaleX: number, scaleY: number) => {
    return new Float32Array([
      scaleX, 0, 0,
      0, scaleY, 0,
      0, 0, 1
    ])
  },
  translation: (translateX: number, translateY: number) => {
    return new Float32Array([
      1, 0, translateX,
      0, 1, translateY,
      0, 0, 1
    ])
  },
  rotation: (degrees: number) => {
    const cos = Math.cos(degrees / 180 * Math.PI)
    const sin = Math.sin(degrees / 180 * Math.PI)
    return new Float32Array([
      cos, -sin, 0,
      sin, cos, 0,
      0, 0, 1
    ])
  },
  dot: (m0: Float32Array, m1: Float32Array) => {
    const newMatrix = new Float32Array(9)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let sum = 0
        for (let k = 0; k < 3; k++) {
          sum += m0[i * 3 + k] * m1[k * 3 + j]
        }
        newMatrix[i * 3 + j] = sum
      }
    }
    return newMatrix
  },
  isEqual: (m0: Float32Array, m1: Float32Array) => {
    if (m0.length !== m1.length) {
      console.log(m0, m1)
      return false
    }
    for (let i = 0; i < m0.length; i++) {
      if (m0[i] !== m1[i]) {
        console.log(m0, m1)
        return false
      }
    }
    return true
  },
  projection: () => {
    return new Float32Array([
      2 / canvas.width, 0, 0,
      0, -2 / canvas.height, 0,
      0, 0, 1
    ])
  },
  transpose: (m: Float32Array) => {
    return new Float32Array([
      m[0 * 3 + 0], m[1 * 3 + 0], m[2 * 3 + 0],
      m[0 * 3 + 1], m[1 * 3 + 1], m[2 * 3 + 1],
      m[0 * 3 + 2], m[1 * 3 + 2], m[2 * 3 + 2],
    ])
  }
}
// console.log(m3.isEqual(m3.dot(m3.scale(1, 1), m3.identity()), new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])))
// console.log(m3.isEqual(m3.dot(m3.scale(2, 2), m3.identity()), new Float32Array([2, 0, 0, 0, 2, 0, 0, 0, 1])))
// console.log(m3.isEqual(m3.dot(m3.scale(2, 2), m3.identity()), new Float32Array([1, 0, 0, 0, 2, 0, 0, 0, 1])) === false)
// console.log(m3.isEqual(m3.dot(m3.rotation(90), m3.identity()), new Float32Array([0, 1, 0, -1, 0, 0, 0, 0, 1])))
// console.log(m3.isEqual(m3.dot(m3.translation(5, 2), m3.identity()), new Float32Array([1, 0, 5, 0, 1, 2, 0, 0, 1])))


// Program
const program = createProgram(gl, vs, fs)

// Location
const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
const colorAttributeLocation = gl.getAttribLocation(program, "a_color")
const u_matrixLoc = gl.getUniformLocation(program, "u_matrix")

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
console.log(m3.scale(1, 1))
var matrix = m3.identity()
matrix = m3.rotation(0)
matrix = m3.dot(m3.translation(0, 0), matrix)
matrix = m3.dot(m3.projection(), matrix)

// matrix = m3.dot(, matrix)  
gl.uniformMatrix3fv(u_matrixLoc, true, matrix)
gl.bindVertexArray(vao)

// Buffer
const positions = [
  0, 0,
  300, 0,
  300, 290,
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



export default App
