import { m4 } from "./m4"


// shaders
const vs = `#version 300 es
	in vec4 a_position;
	in vec4 a_color;

	uniform mat4 u_matrix;

	out vec4 v_color;

	void main(){
		v_color = a_color;
		gl_Position = u_matrix * a_position;
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

export function createWebglRenderer(canvas: HTMLCanvasElement) {
	const api = {
		clear: () => {
			// Reset matrix
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			// Reset transform
			transformMatrix = m4.identity()
		},
		draw: () => {
			// Apply perspective matrix and upload to gpu
			// console.log("transformMatrix", transformMatrix)
			transformMatrix = m4.dot(m4.perspective3(Math.PI * 0.6, 1), m4.inverse(transformMatrix))
			gl.uniformMatrix4fv(u_matrixLoc, true, transformMatrix)

			// Draw
			gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3)
		},
		scale: (sx: number, sy: number, sz: number) => transformMatrix = m4.dot(m4.scaling(sx, sy, sz), transformMatrix),
		translate: (tx: number, ty: number, tz: number) => transformMatrix = m4.dot(m4.translation(tx, ty, tz), transformMatrix),
		rotateX: (degreeX: number) => transformMatrix = m4.dot(m4.rotationX(degreeX), transformMatrix),
		rotateY: (degreeY: number) => transformMatrix = m4.dot(m4.rotationY(degreeY), transformMatrix),
		rotateZ: (degreeZ: number) => transformMatrix = m4.dot(m4.rotationZ(degreeZ), transformMatrix)
	}

	console.log("createWebglRenderer was called!")
	// canvas
	// const canvas = document.querySelector("canvas") as HTMLCanvasElement
	canvas.width = 300 * 4
	canvas.height = 300 * 3
	// document.querySelector("body")?.append(canvas)
	canvas.style.width = `${canvas.width}px`
	canvas.style.height = `${canvas.height}px`

	// gl
	let gl = getWebglContext(canvas)

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
	gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(positionAttributeLocation)

	// COLOR
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
	gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0)
	gl.enableVertexAttribArray(colorAttributeLocation)

	// Buffer
	const positions = [
		// Length front
		0, 0, 0,
		30, 0, 0,
		30, 130, 0,
		0, 0, 0,
		30, 130, 0,
		0, 130, 0,

		// Protrude front
		30, 0, 0,
		60, 0, 0,
		60, 30, 0,
		30, 0, 0,
		60, 30, 0,
		30, 30, 0,

		// Length right
		30, 30, 0,
		30, 30, 30,
		30, 130, 30,
		30, 30, 0,
		30, 130, 30,
		30, 130, 0,

		// Protrude right
		60, 0, 0,
		60, 0, 30,
		60, 30, 30,
		60, 0, 0,
		60, 30, 30,
		60, 30, 0,

		// Length back
		0, 0, 30,
		30, 130, 30,
		30, 0, 30,
		0, 0, 30,
		0, 130, 30,
		30, 130, 30,

		// Protrude back
		30, 0, 30,
		60, 30, 30,
		60, 0, 30,
		30, 0, 30,
		30, 30, 30,
		60, 30, 30,

		// Length left
		0, 0, 0,
		0, 130, 30,
		0, 0, 30,
		0, 0, 0,
		0, 130, 0,
		0, 130, 30,

		// L bottom
		0, 0, 0,
		60, 0, 30,
		60, 0, 0,
		0, 0, 0,
		0, 0, 30,
		60, 0, 30,

		// Length top
		0, 130, 0,
		30, 130, 0,
		30, 130, 30,
		0, 130, 0,
		30, 130, 30,
		0, 130, 30,

		// Protrude top
		30, 30, 0,
		60, 30, 0,
		60, 30, 30,
		30, 30, 0,
		60, 30, 30,
		30, 30, 30,





		// Length front
		100, 0, 100,
		130 * 100, 0, 100,
		130 * 100, 130, 100,
		100, 0, 100,
		130 * 100, 130, 100,
		100, 130, 100,

		// Protrude front
		130, 0, 100,
		160, 0, 100,
		160, 30, 100,
		130, 0, 100,
		160, 30, 100,
		130, 30, 100,

		// Length right
		130, 30, 100,
		130, 30, 130,
		130, 130, 130,
		130, 30, 100,
		130, 130, 130,
		130, 130, 100,

		// Protrude right
		160, 0, 100,
		160, 0, 130,
		160, 30, 130,
		160, 0, 100,
		160, 30, 130,
		160, 30, 100,

		// Length back
		100, 0, 130,
		130, 130, 130,
		130, 0, 130,
		100, 0, 130,
		100, 130, 130,
		130, 130, 130,

		// Protrude back
		130, 0, 130,
		160, 30, 130,
		160, 0, 130,
		130, 0, 130,
		130, 30, 130,
		160, 30, 130,

		// Length left
		100, 0, 100,
		100, 130, 130,
		100, 0, 130,
		100, 0, 100,
		100, 130, 100,
		100, 130, 130,

		// L bottom
		100, 0, 100,
		160, 0, 130,
		160, 0, 100,
		100, 0, 100,
		100, 0, 130,
		160, 0, 130,

		// Length top
		100, 130, 100,
		130 * 100, 130, 100,
		130 * 100, 130, 130 * 100,
		100, 130, 100,
		130 * 100, 130, 130 * 100,
		100, 130, 130 * 100,

		// Protrude top
		130, 30, 100,
		160, 30, 100,
		160, 30, 130,
		130, 30, 100,
		160, 30, 130,
		130, 30, 130,

	]
	const colors = [
		// Length front
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,

		// Protrude
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,

		// Protrude right
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,

		// length right
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,

		// Length back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// Protrude back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// Length left
		0, 255, 255, 255,
		0, 255, 255, 255,
		0, 255, 255, 255,
		0, 255, 255, 255,
		0, 255, 255, 255,
		0, 255, 255, 255,

		// L bottom
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,

		// Length top
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,

		// Protrude top
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,





		// Length front
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,

		// Protrude
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,

		// Protrude right
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,

		// length right
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,

		// Length back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// Protrude back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// Length left
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,
		189, 181, 144, 255,

		// L bottom
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,
		255, 0, 255, 255,

		// Length top
		27, 84, 75, 255,
		27, 84, 75, 255,
		27, 84, 75, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,


		// Protrude top
		187, 200, 118, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,
		187, 200, 118, 255,



	]
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
	gl.bindBuffer(gl.ARRAY_BUFFER, null)


	// program use
	gl.useProgram(program)
	let transformMatrix = m4.identity()
	transformMatrix = m4.dot(m4.scaling(1.5, 1.5, 1.5), transformMatrix)
	transformMatrix = m4.rotationY(30)
	transformMatrix = m4.dot(m4.translation(0, 0, 100), transformMatrix)
	transformMatrix = m4.dot(m4.perspective3(Math.PI * 0.6666, 1), transformMatrix)

	// matrix = m4.dot(, matrix)  
	gl.uniformMatrix4fv(u_matrixLoc, true, transformMatrix)
	gl.clearColor(1, 1, 1, 1)
	gl.clearColor(168 / 255, 205 / 255, 224 / 255, 1)
	// gl.clearColor(198 / 255, 204 / 255, 204 / 255, 1)
	gl.clearColor(187 / 255, 227 / 255, 248 / 255, 1)
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3)

	// Need to reset identity so next render doesn't contain previous render's transforms
	transformMatrix = m4.identity()

	return api
}

/* 
	  WEBGL FUNCTIONS
*/
function getWebglContext(canvas: HTMLCanvasElement) {
	const gl = canvas.getContext("webgl2")
	if (!gl) throw new Error("ss")
	return gl
}
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
