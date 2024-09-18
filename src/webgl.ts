export function createWebglRenderer(canvas: HTMLCanvasElement) {

	// canvas
	// const canvas = document.querySelector("canvas") as HTMLCanvasElement
	canvas.width = 300
	canvas.height = 300
	// document.querySelector("body")?.append(canvas)

	// gl
	let gl = getWebglContext(canvas)

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


	// program use
	gl.useProgram(program)
	var transformMatrix = m4.identity()
	transformMatrix = m4.rotationZ(0)
	transformMatrix = m4.dot(m4.translation(0, 0, 0), transformMatrix)
	transformMatrix = m4.dot(m4.orthographic(canvas.width, canvas.height, canvas.height), transformMatrix)

	// matrix = m4.dot(, matrix)  
	gl.uniformMatrix4fv(u_matrixLoc, true, transformMatrix)
	gl.bindVertexArray(vao)

	// Buffer
	const positions = [
		// Length front
		0, 0, 0,
		30, 130, 0,
		30, 0, 0,
		0, 0, 0,
		0, 130, 0,
		30, 130, 0,

		// length right
		30, 0, 0,
		30, 130, 0,
		30, 130, 30,
		30, 0, 0,
		30, 130, 30,
		30, 0, 30,

		// length back
		30, 100, 30,
		60, 130, 30,
		30, 130, 30,
		30, 100, 30,
		60, 100, 30,
		60, 130, 30,

		// length right
		0, 0, 0,
		0, 130, 30,
		0, 130, 0,
		0, 0, 0,
		0, 0, 30,
		0, 130, 30,

		// protrude front
		30, 100, 0,
		30, 130, 0,
		60, 130, 0,
		30, 100, 0,
		60, 130, 0,
		60, 100, 0,

		// protrude back
		0, 0, 30,
		30, 0, 30,
		30, 130, 30,
		0, 0, 30,
		30, 130, 30,
		0, 130, 30,

		// protrude right
		60, 100, 0,
		60, 130, 30,
		60, 100, 30,
		60, 100, 0,
		60, 130, 0,
		60, 130, 30,

		// protrude top
		30, 100, 0,
		60, 100, 0,
		30, 100, 30,
		30, 100, 30,
		60, 100, 0,
		60, 100, 30,

		// length top
		0, 0, 0,
		30, 0, 0,
		30, 0, 30,
		0, 0, 0,
		30, 0, 30,
		0, 0, 30,

		// bottom l
		0, 130, 0,
		60, 130, 30,
		60, 130, 0,
		0, 130, 0,
		0, 130, 30,
		60, 130, 30,
	]
	const colors = [
		// Length front
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,
		255, 0, 0, 255,

		// length right
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,
		255, 255, 0, 255,

		// length back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// length left
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,
		0, 255, 0, 255,

		// protrude front
		255, 100, 0, 255,
		255, 100, 0, 255,
		255, 100, 0, 255,
		255, 100, 0, 255,
		255, 100, 0, 255,
		255, 100, 0, 255,

		// protrude back
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,
		0, 0, 255, 255,

		// protrude right
		255, 200, 0, 255,
		255, 200, 0, 255,
		255, 200, 0, 255,
		255, 200, 0, 255,
		255, 200, 0, 255,
		255, 200, 0, 255,

		// protrude top
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,

		// length top
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,
		0, 200, 255, 255,

		// bottom l
		255, 100, 255, 255,
		255, 100, 255, 255,
		255, 100, 255, 255,
		255, 100, 255, 255,
		255, 100, 255, 255,
		255, 100, 255, 255,
	]
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
	gl.bindBuffer(gl.ARRAY_BUFFER, null)

	gl.clearColor(1, 1, 1, 1)
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3)
	console.log("ran!!!")

	const api = {
		clear: () => gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT),
		draw: () => {
			// Apply orthographic matrix and upload to gpu
			transformMatrix = m4.dot(m4.orthographic(canvas.width, canvas.height, canvas.height), transformMatrix)
			gl.uniformMatrix4fv(u_matrixLoc, true, transformMatrix)

			// Draw
			gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3)

			// Reset matrix
			transformMatrix = m4.identity()
		},
		scale: (sx: number, sy: number) => transformMatrix = m4.dot(m4.scale(sx, sy, 1), transformMatrix),
		translate: (tx: number, ty: number, tz: number) => transformMatrix = m4.dot(m4.translation(tx, ty, tz), transformMatrix),
		rotateX: (degreeX: number) => transformMatrix = m4.dot(m4.rotationX(degreeX), transformMatrix),
		rotateY: (degreeY: number) => transformMatrix = m4.dot(m4.rotationY(degreeY), transformMatrix),
		rotateZ: (degreeZ: number) => transformMatrix = m4.dot(m4.rotationZ(degreeZ), transformMatrix)
	}

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


/* HELPER FUNCTIONS */
const m4 = {
	identity: () => {
		return new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	},
	scale: (scaleX: number, scaleY: number, scaleZ: number) => {
		return new Float32Array([
			scaleX, 0, 0, 0,
			0, scaleY, 0, 0,
			0, 0, scaleZ, 0,
			0, 0, 0, 1
		])
	},
	translation: (translateX: number, translateY: number, translateZ: number) => {
		return new Float32Array([
			1, 0, 0, translateX,
			0, 1, 0, translateY,
			0, 0, 1, translateZ,
			0, 0, 0, 1
		])
	},
	rotationZ: (degrees: number) => {
		const cos = Math.cos(degrees / 180 * Math.PI)
		const sin = Math.sin(degrees / 180 * Math.PI)
		return new Float32Array([
			cos, sin, 0, 0,
			-sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	},
	rotationY: (degrees: number) => {
		const cos = Math.cos(degrees / 180 * Math.PI)
		const sin = Math.sin(degrees / 180 * Math.PI)
		return new Float32Array([
			cos, 0, sin, 0,
			0, 1, 0, 0,
			-sin, 0, cos, 0,
			0, 0, 0, 1
		])
	},
	rotationX: (degrees: number) => {
		const cos = Math.cos(degrees / 180 * Math.PI)
		const sin = Math.sin(degrees / 180 * Math.PI)
		return new Float32Array([
			1, 0, 0, 0,
			0, cos, -sin, 0,
			0, sin, cos, 0,
			0, 0, 0, 1
		])
	},
	dot: (m0: Float32Array, m1: Float32Array) => {
		const newMatrix = new Float32Array(16)
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let sum = 0
				for (let k = 0; k < 4; k++) {
					sum += m0[i * 4 + k] * m1[k * 4 + j]
				}
				newMatrix[i * 4 + j] = sum
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
	orthographic: (width: number, height: number, depth: number) => {
		return new Float32Array([
			2 / width, 0, 0, -1,
			0, -2 / height, 0, 1,
			0, 0, 2 / depth, 0,	// imo it should be 1/depth instead of 2/depth as that way a triangle the len of the screen can rotate around Z without clipping
			0, 0, 0, 1

			// , 0, -1,
			// 0, , 1,
			// 0, 0, 1
		])
	}
}