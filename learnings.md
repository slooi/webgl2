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