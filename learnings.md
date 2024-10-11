# Webgl 2.0 Learnings
- glsl & thus webgl/opengl uses COLUMN-MAJOR order
- You get very easily (<5mins) write the proof to show that A*B*v is the same as glslMultiplication((A*B)^T,v) 
- A tranposed matrix has the order of the matrices applied. (AB)^T === (B^T*A^T) <= Though this isn't relevant
- We are using HOMOGENEOUS COORDINATES (we are only viewing a projection of the full thing (x,y,z,1))
- Note linear transformations prevent shifting of origin, but using homogeneous coordinates we can produce the perception of moving the origin for a projection without actually changing the origin


```
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
- the `3` only defines how to read the ATTRIBUTES of the buffer. This does NOT mean the glsl position variable will have 3 dimensions. Note if you only supply 3 variables but set the attribute to a vec4, then the 4th value will automatically be a `1`. Essentionally you supplied 3 dimensions but the variable will have 4.
```


## What to look out for when going from 2d->3d
```
in vec4 a_position
uniform mat4 u_matrix
gl_Position = u_matrix * a_position
gl.vertexAttribPointer(positionAttributeLocation, 2...)     ->		gl.vertexAttribPointer(positionAttributeLocation, 3...)
uniformMatrix3fv 											->		uniformMatrix4fv
const positions2d = [
	0, 0,
	300, 0,
	290, 300
]
const positions3d = [
	0, 0, 0,
	300, 0, 0,
	290, 300, 0,
]
```
- Make sure to use for loops for m3.dot so it can scale to m4.dot super easily
- Iterate quickly by testing that rotationZ works before doing the other rotations



# Remember to
- gl.enable(gl.DEPTH_TEST) and gl.enable(gl.CULL_FACE) <= note you can NOT bit OR them
- remember your rotation transformations will be applied BEFORE the orthographic and perspective transformations. This means if your ortho/perspective transforms flip the positive y axis to be positive going down, you will have to conisder how this will affect the direction of rotation for the rotation transformations

# Notes
WebGL is concerned, whether or not a triangle is considered to be going clockwise or counter clockwise depends on the vertices of that triangle in clip space. In other words, WebGL figures out whether a triangle is front or back AFTER you've applied math to the vertices in the vertex shader
- Use `canvas.clientWidth` instead of `canvas.width` when transforming to clipspace. This is because it ensures that the coordinates you use match the playspace instead of the actual canvas viewport which allows you to do low res renders if needed

# Adding 3d PERSPECTIVE
- webgl in the glsl code automatically divides x, y and z???(it seems like it?) by w
- imo the orthographic view should be 1/depth instead of 2/depth as that way a triangle the len of the screen can rotate around Z without clipping
- When 3d perspective is added, when z is large (>1), the point moves towards the center of the screen as the original CLIPSPACE coords have x=0, y=0 centered in the MIDDLE of the screen and because x'=x/z, y'=y/z. It uses the CLIPSPACE coords as 
- To get BASIC perspective we divide the x & y by `1.0 + fudgeFactor * position.z`. The `1.0` combined with a `fudgeFactor` set to `0` will create a view identical to the orthographic view. Set fudgeFactor to a val > 0 to start using it. 
```
			vec4 position = u_matrix * a_position;

			float divideBy = 1.0 + fudgeFactor * position.z;
			gl_Position = vec4(position.xyz,divideBy);
```
```
		return new Float32Array([
			2 / width, 0, 0, -1,
			0, -2 / height, 0, 1,
			0, 0, 2 / depth, 0,	// imo it should be 1/depth instead of 2/depth as that way a triangle the len of the screen can rotate around Z without clipping
			0, 0, 2 / depth * fudgeFactor, 1
		])
```


- Honestly, i think setup would be a lot less buggy if you implemented 3d without doing the width/height/moving00ToTopLeft stuff
```
		return new Float32Array([
			1 / width, 0, 0, 0,
			0, 1 / height, 0, 0,
			0, 0, 2 / depth, 0,
			0, 0, 2 / depth * fudgeFactor, 1
		])
```
- aspect must be the `canvas.clientWidth / canvas.clientHeight` to ensure that the there's no compression or expansion of the number of pixels on the x axis
- REMEMBER!!!!! WHEN CALCULATING THE adjugate, the there is a transpose!!!!! A_ij = (-1)^(i+j) |M_ji| <= I FORGOT THIS!


# TEXTURES
- !@#!@#!@# gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)	// <= YOU WILL GET TEXTURE ARTIFACTS TEXTURE_MIN_FILTER is not set
- !@#!@#!@# UNIFORMS ARE 1000% DEPENDENT ON THE PROGRAM!!!!!!!!!!@#!@#!@# BECAUSE OF THIS, YOU ALWAYS HAVE TO CALL gl.useProgram BEFORE setting uniforms!!! EG:
```ts
	gl.useProgram(program)
	gl.uniform1i(textureUniformLocation, 1)
```
- Image texture not appearing? I screen black? Have you made sure that the gl.drawArrays is called AFTER the img.onload code has run? Make 100% sure that the img.onload texture code has run before calling gl.drawArrays. Whenever using textures, ALWAYS CHECK THAT TEXTURE HAS LOAED FIRST! In fact you should 1) Load resources, 2) THEN make texture
- Get texture size using glsl + get pixel:   vec2 onePixel = 1.0/vec2(textureSize(u_Texture,0));
- If you are only getting white after applying a kernel fliter, check that you aren't doing the below (you need ALPHA!!!):
```GLSL
  color = (
     texture(u_Texture,v_Texcoord+onePixel*vec2(-1,-1))*u_Kernel[0]*1.0
    )/9.0;
```

If you don't want to supply an image, you can supply null
```ts
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
```

- Remember to set the width and height of the texture if you're going to use renderbuffer!
```ts
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, initWidth, initHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
```


# Pro/Cons of classes compared to factory function
- can NOT do hoisting with classes unlike factory functions
## Pro classes
## Pro factory function
-

# Renderer organize for the future
- model:
 - positions:[]
 - normals:[]
 - texcoords:[]
 - frag:
 - vertex:
 - texture:
- renderer:
 - loadModel()
 - currentActiveTexture
 - currentUseProgram
 - models: [
	{
		a_PositionLocation???
	}
 ]


# Always continuously build to your target platform from day 1!
- Found that build does not work on github pages despite working on pc. Also found that it didn't work on mobile either.

# Differences between PC(windows+firefox) and mobile(android firefox & android chrome)
## Example
`#version 300 es
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
`#version 300 es
	precision highp float;

	in vec4 v_color;
	in vec2 v_texcoord;

	out vec4 outColor; 

	uniform sampler2D u_texture;

	void main(){
		outColor = texture(u_texture,v_texcoord);
	}
`
PC
- The above glsl code will have return `3` for gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES)
MOBILE
- The above glsl code will have return `2` for gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES)
- Mobile IGNORES attributes if they are not used! Like in the fragment shader `v_color` is optimized out.
## LESSON
- Do NOT use the model data as the source of truth for the vertexData!!! Use the `gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES)` as the source of truth!

# question
is there chance to get undefined/nan due to dividing by 0?

# QUIZ

	

QUIZ: What happens?
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
		gl.activeTexture(gl.TEXTURE0 + 1)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		gl.generateMipmap(gl.TEXTURE_2D)
	}
	gl.uniform1i(textureUniformLocation, 0)


ANSWER: Renders blue, then renders img texture once image loads. 
EXPLANATION: Ultimately, only the texture bound at texture unit 0 determines the texture the shader uses. So even though we've set the activeTexture to +1, we've called bindTexture(gl.TEXTURE_2D, texture), which binds the
texture buffer holding the blue pixel, which is then replaced with the texture image due to texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img). So both texture unit 0 & 1 point to the same texture, which
has ben updated to hold the texture image.









QUIZ: What happens?

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
		gl.activeTexture(gl.TEXTURE0 + 1)
		const texture = gl.createTexture()		// !@#!@#!@# NEWLINE
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		gl.generateMipmap(gl.TEXTURE_2D)
	}
	gl.uniform1i(textureUniformLocation, 0) // This indicates that the var at `textureUniformLocation` should use texture unit 0

ANSWER: Will display blue.
EXPLANATION: The gl.createTexture will mean there will be a total of 2 textures. one exists on texture unit 0. another will exist on texture unit 1. Because the TEXTURE_UNIT_1 has a different texture than TEXTURE_UNIT 0, 
the updates in the onload function only affect the new texture in TEX_UNIT_1.