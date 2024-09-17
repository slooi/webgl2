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