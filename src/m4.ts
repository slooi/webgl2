
/* HELPER FUNCTIONS */
const m4 = {
	scale: (m4x4: Float32Array, sx: number, sy: number, sz: number) => m4x4 = m4.dot(m4.scaling(sx, sy, sz), m4x4),
	translate: (m4x4: Float32Array, tx: number, ty: number, tz: number) => m4x4 = m4.dot(m4.translation(tx, ty, tz), m4x4),
	rotateX: (m4x4: Float32Array, degreeX: number) => m4x4 = m4.dot(m4.rotationX(degreeX), m4x4),
	rotateY: (m4x4: Float32Array, degreeY: number) => m4x4 = m4.dot(m4.rotationY(degreeY), m4x4),
	rotateZ: (m4x4: Float32Array, degreeZ: number) => m4x4 = m4.dot(m4.rotationZ(degreeZ), m4x4),
	identity: () => {
		return new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	},
	scaling: (scaleX: number, scaleY: number, scaleZ: number) => {
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
			cos, -sin, 0, 0,
			sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	},
	rotationY: (degrees: number) => {
		const cos = Math.cos(degrees / 180 * Math.PI)
		const sin = Math.sin(degrees / 180 * Math.PI)
		return new Float32Array([
			cos, 0, -sin, 0,
			0, 1, 0, 0,
			sin, 0, cos, 0,
			0, 0, 0, 1
		])
	},
	rotationX: (degrees: number) => {
		const cos = Math.cos(degrees / 180 * Math.PI)
		const sin = Math.sin(degrees / 180 * Math.PI)
		return new Float32Array([
			1, 0, 0, 0,
			0, cos, sin, 0,
			0, -sin, cos, 0,
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
	},
	basicPerspective: (width: number, height: number, depth: number, fudgeFactor: number = 1) => {
		return new Float32Array([
			2 / width, 0, 0, -1,
			0, -2 / height, 0, 1,
			0, 0, 2 / depth, 0,	// imo it should be 1/depth instead of 2/depth as that way a triangle the len of the screen can rotate around Z without clipping
			0, 0, 2 / depth * fudgeFactor, 1
		])
	},
	answerPerspective: (fovRadians: number, aspect: number, zNear: number = 0.01, zFar: number = 1000000) => {
		/* aspect is assumed to be a value > 1 */
		const f = Math.tan((Math.PI - fovRadians) / 2)
		return new Float32Array([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (zNear + zFar) / (zFar - zNear), (2 * zFar * zNear) / (zFar - zNear),
			0, 0, 1, 1
		])
	},
	perspective: (fovRadians: number, aspect: number, zNear: number = 0.01, zFar: number = 1000000) => {
		/* aspect is assumed to be a value > 1 */
		const f = Math.tan((Math.PI - fovRadians) / 2)
		return new Float32Array([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, - (zNear + zFar) / (zNear - zFar), (2 * zNear * zFar) / (zNear - zFar),
			0, 0, 1, 1
		])
	},
	inverse: (m: Float32Array) => {
		// source: https://semath.info/src/inverse-cofactor-ex4.html
		const det =
			m[0 * 4 + 0] * m4.mat4ToDet(m, 0, 0)
			- m[1 * 4 + 0] * m4.mat4ToDet(m, 1, 0)
			+ m[2 * 4 + 0] * m4.mat4ToDet(m, 2, 0)
			- m[3 * 4 + 0] * m4.mat4ToDet(m, 3, 0);

		if (det === 0) return new Float32Array(16); // Return zero matrix if determinant is zero
		const detInverse = 1 / det

		return m4.transpose(new Float32Array([
			m4.mat4ToDet(m, 0, 0) * detInverse, -m4.mat4ToDet(m, 0, 1) * detInverse, m4.mat4ToDet(m, 0, 2) * detInverse, -m4.mat4ToDet(m, 0, 3) * detInverse,

			-m4.mat4ToDet(m, 1, 0) * detInverse, m4.mat4ToDet(m, 1, 1) * detInverse, -m4.mat4ToDet(m, 1, 2) * detInverse, m4.mat4ToDet(m, 1, 3) * detInverse,

			m4.mat4ToDet(m, 2, 0) * detInverse, -m4.mat4ToDet(m, 2, 1) * detInverse, m4.mat4ToDet(m, 2, 2) * detInverse, -m4.mat4ToDet(m, 2, 3) * detInverse,

			-m4.mat4ToDet(m, 3, 0) * detInverse, m4.mat4ToDet(m, 3, 1) * detInverse, -m4.mat4ToDet(m, 3, 2) * detInverse, m4.mat4ToDet(m, 3, 3) * detInverse,
		]))
	},
	mat4ToDet: (m: Float32Array, row: number, col: number): number => {
		return m4.preDetToDet(m4.mat4ToPreDet3(m, row, col))
	},
	mat4ToPreDet3: (m4: Float32Array, row: number, col: number): Float32Array => {
		if (m4.length !== 16) throw new Error("ERROR: length not 16")
		if (row > 3 || col > 3) throw new Error("ERROR: row and/or col values are too large")
		const tempM = new Float32Array(9)

		let counter = 0;
		for (let i = 0; i < 16; i++) {
			if (Math.floor(i / 4) % 4 === row || i % 4 === col) continue
			tempM[counter] = m4[i]
			counter++
		}
		return tempM
	},
	preDetToDet: (m3: Float32Array): number => {
		if (m3.length !== 9) throw new Error("ERROR: length not 9")

		const a00 = m3[0 * 3 + 0], a01 = m3[0 * 3 + 1], a02 = m3[0 * 3 + 2]
		const a10 = m3[1 * 3 + 0], a11 = m3[1 * 3 + 1], a12 = m3[1 * 3 + 2]
		const a20 = m3[2 * 3 + 0], a21 = m3[2 * 3 + 1], a22 = m3[2 * 3 + 2]

		return a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21
	},
	transpose: (m: Float32Array) => {
		return new Float32Array([
			m[0 * 4 + 0], m[1 * 4 + 0], m[2 * 4 + 0], m[3 * 4 + 0],
			m[0 * 4 + 1], m[1 * 4 + 1], m[2 * 4 + 1], m[3 * 4 + 1],
			m[0 * 4 + 2], m[1 * 4 + 2], m[2 * 4 + 2], m[3 * 4 + 2],
			m[0 * 4 + 3], m[1 * 4 + 3], m[2 * 4 + 3], m[3 * 4 + 3],
		])
	}
}
export { m4 }