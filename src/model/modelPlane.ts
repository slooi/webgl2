import f from "../assets/tex.png"
import { Model } from "./model"

export const model: Model = {
	vertexData: {

		a_position: {
			format: { size: 3, type: Float32Array, normalize: false, }, data: [
				// front
				0, -1000, 0,
				1000, -1000, 0,
				1000, 0, 0,
				0, -1000, 0,
				1000, 0, 0,
				0, 0, 0,
				// left
				0, -1000, 0,
				0, 0, 1000,
				0, -1000, 1000,
				0, -1000, 0,
				0, 0, 0,
				0, 0, 1000,
				// top
				0, 0, 0,
				1000, 0, 0,
				1000, 0, 1000,
				0, 0, 0,
				1000, 0, 1000,
				0, 0, 1000,
			]
		},
		a_color: {
			format: { size: 4, type: Uint8Array, normalize: true }, data: [
				// front
				115, 143, 144, 255,
				115, 143, 144, 255,
				115, 143, 144, 255,
				115, 143, 144, 255,
				115, 143, 144, 255,
				115, 143, 144, 255,
				// left
				203, 198, 160, 255,
				203, 198, 160, 255,
				203, 198, 160, 255,
				203, 198, 160, 255,
				203, 198, 160, 255,
				203, 198, 160, 255,
				// top
				27, 84, 75, 255,
				27, 84, 75, 255,
				27, 84, 75, 255,
				187, 200, 118, 255,
				187, 200, 118, 255,
				187, 200, 118, 255,
			]
		},
		a_texcoord: {
			format: { size: 2, type: Float32Array, normalize: false }, data: [
				// front
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				// left
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				0, 0,
				// top
				0, 0,
				1, 0,
				1, 1,
				0, 0,
				1, 1,
				0, 1
			]
		},
	},
	vs: `#version 300 es
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
	`,
	fs: `#version 300 es
		precision highp float;

		in vec4 v_color;
		in vec2 v_texcoord;

		out vec4 outColor; 

		uniform sampler2D u_texture;

		void main(){
			outColor = texture(u_texture,v_texcoord);
		}
	`,
	texture: f
}