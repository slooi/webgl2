
console.log("############# ITS HERE ##############")
console.log(m4.mat4ToPreDet3(new Float32Array([
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]), 0, 0))
console.log(m4.mat4ToPreDet3(new Float32Array([
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]), 1, 1))
/* 
134
9,11,12
13,15,16
*/
console.log(m4.mat4ToPreDet3(new Float32Array([
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]), 3, 3))
/* 
1,2,3
567
9,10,11
*/
console.log(m4.mat4ToPreDet3(new Float32Array([
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]), 2, 3))
/* 
1,2,3
5,6,7,
13,14,15
*/
console.log(m4.mat4ToPreDet3(new Float32Array([
	1, 2, 3, 4,
	5, 6, 7, 8,
	9, 10, 11, 12,
	13, 14, 15, 16
]), 2, 2))
/* 
1,2,4
5,6,8,
13,14,16
*/