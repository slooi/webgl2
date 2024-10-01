export const model = {
	vertexData: {

		a_position: {
			format: { size: 3, type: Float32Array, normalize: false, }, data: [
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
			]
		},
		a_color: {
			format: { size: 4, type: Uint8Array, normalize: true, }, data: [

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
			]
		},
	},
	vs: `#version 300 es
		in vec4 a_position;
		in vec4 a_color;

		uniform mat4 u_matrix;

		out vec4 v_color;

		void main(){
			v_color = a_color;
			gl_Position = u_matrix * a_position;
		}
	`,
	fs: `#version 300 es
		precision highp float;

		in vec4 v_color;

		out vec4 outColor; 


		void main(){
			outColor = v_color;
		}
	`
}