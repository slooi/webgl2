import { m4 } from "./m4"
import { Model } from "./model/model"
import { model } from "./model/modelPlane"


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
	const program = createProgram(gl, model.vs, model.fs)

	// Location
	const programAttributeLocations = getAttributeLocationsFromProgram(gl, program)
	const programUniformLocations = getUniformLocationsFromProgram(gl, program)
	const modelContainer = {
		programAttributeLocations: programAttributeLocations,
		programUniformLocations: programUniformLocations,
		...model
	}
	console.log("programAttributeLocations", programAttributeLocations)

	// Uniform Locations
	// const u_matrixLoc = gl.getUniformLocation(program, "u_matrix")
	// const textureUniformLocation = gl.getUniformLocation(program, "u_texture")
	// console.log("!!!!!!!!!!!!!!", textureUniformLocation)

	// ########################################################################
	// 					create buffers w/ attributes for obj
	const vao = setupProgramVertexAttributeArrayAndBuffers(gl, modelContainer)

	// ########################################################################
	// 					textures
	// ########################################################################
	setupModelTexture(gl, modelContainer)


	// ########################################################################
	// 					use program (for uniforms + what shader? to use) + use program's uniforms
	// ########################################################################
	// program use
	gl.useProgram(program)
	let transformMatrix = m4.identity()
	transformMatrix = m4.dot(m4.perspective(Math.PI * 0.6666, 1), m4.rotateY(m4.translate(transformMatrix, 100, 0, 100), 30))
	gl.uniformMatrix4fv(modelContainer.programUniformLocations["u_matrix"], true, transformMatrix)



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
	gl.drawArrays(gl.TRIANGLES, 0, model.vertexData.a_position.data.length / 3)


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
			gl.uniformMatrix4fv(modelContainer.programUniformLocations["u_matrix"], true, transformMatrix)

			// Draw
			gl.drawArrays(gl.TRIANGLES, 0, model.vertexData.a_position.data.length / 3)
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

function setupModelTexture(gl: WebGL2RenderingContext, modelContainer: { programAttributeLocations: ReturnType<typeof getAttributeLocationsFromProgram>, programUniformLocations: ReturnType<typeof getUniformLocationsFromProgram> } & Model) {
	if (!modelContainer.texture) return

	const texture = gl.createTexture()
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)	// <= YOU WILL GET TEXTURE ARTIFACTS TEXTURE_MIN_FILTER is not set

	var img = new Image()
	img.src = modelContainer.texture
	img.onload = () => {
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		gl.generateMipmap(gl.TEXTURE_2D)
	}
	gl.uniform1i(modelContainer.programUniformLocations["u_texture"], 0)

	return texture
}
function setupProgramVertexAttributeArrayAndBuffers(gl: WebGL2RenderingContext, modelContainer: { programAttributeLocations: ReturnType<typeof getAttributeLocationsFromProgram>, programUniformLocations: ReturnType<typeof getUniformLocationsFromProgram> } & Model) {
	const vao = gl.createVertexArray()
	if (!vao) throw new Error("ERROR: vao is null!")
	gl.bindVertexArray(vao)

	// Create list of attribute names using the model's `vertexData`
	const attributeNameArray = (Object.keys(modelContainer.vertexData) as Array<keyof typeof modelContainer.vertexData>)
	attributeNameArray.map(name => {
		const vertexAttribute = modelContainer.vertexData[name]
		if (!vertexAttribute) throw new Error("ERROR: this vertdata does NOT exist!")
		// Get vertexAttributeArray params
		const location = modelContainer.programAttributeLocations[name]
		const format = vertexAttribute.format
		const glType = format.type === Float32Array ? gl.FLOAT : format.type === Uint8Array ? gl.UNSIGNED_BYTE : (() => { throw new Error("ERROR: NOT SUPPOSED TYPE WAS USED") })()
		const normalize = format.normalize
		const size = format.size

		// WEBGL INIT
		const buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(location, size, glType, normalize, 0, 0)
		gl.enableVertexAttribArray(location)
		gl.bufferData(gl.ARRAY_BUFFER, new format.type(vertexAttribute.data), gl.STATIC_DRAW)
	})
	return vao
}
function getUniformLocationsFromProgram(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
	const programUniformLocations: { [name: string]: WebGLUniformLocation } = {}
	for (let i = 0; i < numberOfUniforms; i++) {
		const uniform = gl.getActiveUniform(program, i)
		console.log("uniformName", uniform?.name)
		if (!uniform?.name) throw new Error("ERROR: model uniform has no name!")
		const uniformLocation = gl.getUniformLocation(program, uniform.name)
		console.log("uniformLocation", uniformLocation)
		if (!uniformLocation) throw new Error("ERROR: uniformLocation null!")
		programUniformLocations[uniform.name] = uniformLocation
	}
	console.log("gl.getProgramParameter(gl.ACTIVE_UNIFORMS)", numberOfUniforms)
	console.log("programUniformLocations", programUniformLocations)
	return programUniformLocations
}
function getAttributeLocationsFromProgram(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const numberOfAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
	const programAttributeLocations: { [name: string]: number } = {}
	for (let i = 0; i < numberOfAttributes; i++) {
		const attribute = gl.getActiveAttrib(program, i)
		console.log("attributeName", attribute?.name)
		if (!attribute?.name) throw new Error("ERROR: model attribute has no name!")
		programAttributeLocations[attribute.name] = gl.getAttribLocation(program, attribute.name)
	}
	console.log("gl.getProgramParameter(gl.ACTIVE_ATTRIBUTES)", numberOfAttributes)
	return programAttributeLocations
}
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

	gl.useProgram(program)
	return program
}
