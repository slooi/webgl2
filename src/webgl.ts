import { m4 } from "./m4"
import { modelPlane } from "./model/modelPlane"
import f from "./assets/tex.png"

// shaders
const vs = `#version 300 es
	in vec4 a_position;
	in vec4 a_color;
	in vec2 a_texcoord;

	uniform mat4 u_matrix;

	out vec4 v_color;
	out vec2 v_texcoord;

	void main(){
		v_color = a_color;
		v_texcoord = a_texcoord;
		gl_Position = u_matrix * a_position;
	}
`

const fs = `#version 300 es
	precision highp float;

	in vec4 v_color;
	in vec2 v_texcoord;

	out vec4 outColor; 

	uniform sampler2D u_texture;

	void main(){
		outColor = texture(u_texture,v_texcoord);
	}
`

export function createWebglRenderer(canvas: HTMLCanvasElement) {
	console.log("createWebglRenderer was called!")


	// ########################################################################
	// 					init canvas/gl
	// ########################################################################
	// canvas
	// const canvas = document.querySelector("canvas") as HTMLCanvasElement
	canvas.width = 300 * 2 //window.innerWidth
	canvas.height = 300 * 2 // window.innerHeight

	canvas.style.width = `${canvas.width}px`
	canvas.style.height = `${canvas.height}px`

	// gl
	let gl = getWebglContext(canvas)



	// ########################################################################
	// 					init program/material for obj
	// ########################################################################
	// Program
	const program = createProgram(gl, vs, fs)

	// Location
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
	const colorAttributeLocation = gl.getAttribLocation(program, "a_color")
	const u_matrixLoc = gl.getUniformLocation(program, "u_matrix")
	const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord")
	const textureUniformLocation = gl.getUniformLocation(program, "u_texture")


	// ########################################################################
	// 					create buffers w/ attributes for obj
	// ########################################################################
	// buffer
	const positionBuffer = gl.createBuffer()
	const colorBuffer = gl.createBuffer()
	const texcoordBuffer = gl.createBuffer()

	// vertex array object
	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

	// vertex attrib
	// POSITION
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(positionAttributeLocation)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelPlane.positions), gl.STATIC_DRAW)

	// COLOR
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
	gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0)
	gl.enableVertexAttribArray(colorAttributeLocation)
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(modelPlane.colors), gl.STATIC_DRAW)

	// uv
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
	gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(texcoordAttributeLocation)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelPlane.texcoords), gl.STATIC_DRAW)


	// ########################################################################
	// 					init data for obj
	// ########################################################################
	// Buffer
	const positions = modelPlane.positions
	gl.bindBuffer(gl.ARRAY_BUFFER, null)

	// ########################################################################
	// 					textures
	// ########################################################################
	const texture = gl.createTexture()
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)	// <= YOU WILL GET TEXTURE ARTIFACTS TEXTURE_MIN_FILTER is not set

	var img = new Image()
	img.src = f
	img.onload = () => {
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		gl.generateMipmap(gl.TEXTURE_2D)
	}
	gl.uniform1i(textureUniformLocation, 0)

	// ########################################################################
	// 					use program (for uniforms + what shader? to use) + use program's uniforms
	// ########################################################################
	// program use
	gl.useProgram(program)

	let transformMatrix = m4.identity()
	transformMatrix = m4.dot(m4.perspective(Math.PI * 0.6666, 1), m4.rotateY(m4.translate(transformMatrix, 100, 0, 100), 30))
	gl.uniformMatrix4fv(u_matrixLoc, true, transformMatrix)



	// ########################################################################
	// 						setup global? state
	// ########################################################################
	gl.clearColor(187 / 255, 227 / 255, 248 / 255, 1)
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)



	// ########################################################################
	// 						DRAW :D
	// ########################################################################
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3)


	// ########################################################################
	// 					clean up + return
	// ########################################################################
	// Need to reset identity so next render doesn't contain previous render's transforms
	transformMatrix = m4.identity()
	return {
		clear: () => {
			// Reset matrix
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			// Reset transform
			transformMatrix = m4.identity()
		},
		draw: () => {
			transformMatrix = m4.dot(m4.perspective(Math.PI * 0.5, 1), m4.inverse(transformMatrix))
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
}

/* 
	  WEBGL FUNCTIONS
*/
function getWebglContext(canvas: HTMLCanvasElement) {
	const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true }) // !@#!@#!@# remove later maybe
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
