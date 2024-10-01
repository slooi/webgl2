export type Model = {
	vertexData: {
		a_position: Vertex,
		a_color?: Vertex,
		a_texcoord?: Vertex
	},
	vs: string,
	fs: string,
	texture: string
}
export type Vertex = {
	format: {
		size: number,
		type: Float32Array | Uint8Array,
		normalize: boolean
	},
	data: number[]
}
